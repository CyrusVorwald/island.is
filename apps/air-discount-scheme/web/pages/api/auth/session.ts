//import { getSession } from "next-auth/client"
import { default as getSession } from '../getSession'

export default async (req, res) => {
  return getSession(req, res)
}