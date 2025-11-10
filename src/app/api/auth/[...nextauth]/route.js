import NextAuth from "next-auth";
import { options } from "./options";

const handler = (req, res) => NextAuth(req, res, options);

export const GET = handler;
export const POST = handler;
