import { SMTP_USERNAME } from "./secrets"
import { MailOptions } from "nodemailer/lib/sendmail-transport"
import { SendResponse } from "./types"

export const generateVerificationEmail = (email: string, code: string): MailOptions => {
  let html_string = `
  <div style="text-align:center;font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif">
  <h2>Your Roombuds Verification Code</h2>
  <p>
      Please enter the following code to verify your school/work email:
  </p>
  <h1><font color=459b55">${code}</font></h1>
  <p>
      The code will be active for <u>one hour</u>. If it has expired, you can request a new code from the verification page.
  </p>
  </div>
  `
  return {
    from: SMTP_USERNAME,
    to: email,
    subject: 'Your Roombuds Verification Code',
    html: html_string
  }
}


export const sendVerificationEmail = async (email: string, code: string): Promise<SendResponse> => {
  console.log(code)
  try {
    fetch("/api/send_mail", {
      method: "POST",
      body: JSON.stringify(generateVerificationEmail(email, code)),
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    }).then((res) => {
      if (!res.ok) {
        return { success: false, errorMessage: "Error at /api/send_mail" }
      }
    })
  } catch (error) {
    console.log(error)
    return { success: false, errorMessage: "Error at /api/send_mail" }
  }
  return { success: true }
}

