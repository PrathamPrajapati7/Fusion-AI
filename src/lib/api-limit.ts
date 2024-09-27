import { auth } from "@clerk/nextjs/server";
import { MAX_FREE_COUNTS } from "../../constants";
import prismadb from "./prismadb";

// Function to increase API usage count
export const increaseApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  try {
    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: {
        userId
      }
    });

    if (userApiLimit) {
      await prismadb.userApiLimit.update({
        where: {
          userId: userId
        },
        data: {
          count: userApiLimit.count + 1
        },
      });
    } else {
      await prismadb.userApiLimit.create({
        data: { userId: userId, count: 1 }
      });
    }
  } catch (error) {
    console.error("Error increasing API limit:", error);
    throw new Error("Failed to increase API limit.");
  }
};

// Function to check if user is within API limit
export const checkApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  try {
    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: {
        userId: userId
      }
    });

    if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking API limit:", error);
    return false;
  }
};
