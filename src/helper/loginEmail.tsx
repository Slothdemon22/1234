import React from 'react';

interface EmailTemplateProps {
    name: string;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({ name }) => {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>
                    {`
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: Arial, sans-serif;
                        }
                        .container {
                            width: 100%;
                            background-color: #f0f4f8;
                            padding: 20px;
                        }
                        .email-wrapper {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            padding: 40px;
                            border-radius: 8px;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        }
                        .logo {
                            text-align: center;
                            margin-bottom: 30px;
                            font-size: 36px;
                            font-weight: bold;
                            color: #007bff;
                        }
                        .email-title {
                            font-size: 28px;
                            font-weight: bold;
                            text-align: center;
                            color: #333;
                        }
                        .email-body {
                            font-size: 16px;
                            line-height: 1.6;
                            color: #555;
                            margin: 20px 0;
                            text-align: center;
                        }
                        .cta-button {
                            display: inline-block;
                            background-color: #007bff;
                            color: #ffffff;
                            text-decoration: none;
                            padding: 12px 24px;
                            border-radius: 6px;
                            font-size: 18px;
                            font-weight: bold;
                            margin-top: 20px;
                        }
                        .footer {
                            text-align: center;
                            font-size: 14px;
                            color: #888;
                            margin-top: 10px;
                        }
                    `}
                </style>
            </head>
            <body>
                <div className="container">
                    <div className="email-wrapper">
                        <div className="logo">
                            EVENTLY
                        </div>
                        <h1 className="email-title">Welcome to Evently!</h1>
                        <div className="email-body">
                            <p>Hi <strong>{name}</strong>,</p>
                            <p>
                                Thank you for signing up for Evently. We're thrilled to have you join our
                                community! Get ready to discover and participate in exciting events tailored just for you.
                            </p>
                            <p>We look forward to welcoming you to our events and making your experience exceptional.</p>
                        </div>
                        <div className="footer">
                            <p>&copy; 2024 Evently. All rights reserved.</p>
                            <p>123 Evently Street, City, Country</p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
};

export default EmailTemplate;
