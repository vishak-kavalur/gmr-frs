"use client"
import { nextSessionStorage } from "../utils/constants";
export const setStore = (key, val) => {
    nextSessionStorage()?.setItem(key, val);
    return true;
}

export const getStore = (key) => {
   return nextSessionStorage()?.getItem(key);
};

export const clearStore = () => {
    nextSessionStorage()?.clear();
}