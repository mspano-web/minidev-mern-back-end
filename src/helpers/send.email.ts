/**
 *  end.emails.ts
 */

const nodemailer = require("nodemailer");
const Configuration = require("../config/config");
const { InternalError, StandardError } = require('../errors/errors');

/**
 * Function that allows the assembly and sending of emails from received parameters and taking the system configuration
 * Generate test SMTP service account.  
 * In development we are using ethereal.email: https://ethereal.email/. The emails are sent to the account that we create on the site. The configuration is provided by the site and we place 
 * 
 * @param emailTo    Receiver
 * @param subject    Title
 * @param text       Mail content
 */
export const sendEmail = async (emailTo: string, subject: string, text: string) => {
    
    try {
        if(!emailTo || !subject || !text) throw new InternalError({message: "Send Mail Fail", data: {emailTo: emailTo, subject: subject, text: text}})

        const Cfg = Configuration.getInstance()


        /**
         *  Create reusable transporter object using the default SMTP transport
         */
        const transporter = nodemailer.createTransport({
            host: Cfg.iMail.host,  // Email service host
            port: Cfg.iMail.port, // Host port
            secure: false,  // No SSL security = false
            auth: {  
                user: Cfg.iMail.user, 
                pass: Cfg.iMail.passsword, 
            },
        });

        const mailOptions = {
            from: 'Minidev <minidev@example.com>',  
            to: emailTo,   // List of receivers
            subject: subject,  // Title
            text: text, // Email content in Text format
            // html: "<b>Content</b>", // Email content in HTML format
        }

        // send mail with defined transport object 
        let info = await transporter.sendMail(
            mailOptions, (error: any, info: any) => {
                if (error) {
                    throw new InternalError({message: "Send Mail Fail", data: {error: error, info: info, emailTo: emailTo, subject: subject, text: text}})
                } 
            }
        );
    } catch (e) {
        if (e instanceof InternalError || e instanceof StandardError) { throw(e) } 
        else {  throw new InternalError({message: "Send Mail Fail", data: {emailTo: emailTo, subject: subject, text: text}, exception: e}) }      
    }
};

// ------------------------------------------------------------

