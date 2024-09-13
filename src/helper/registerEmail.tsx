// components/EventTicketEmail.tsx

interface EventTicketEmailProps {
    recipientName: string;
    eventName: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    organizerName: string;
}

const EventTicketEmail = ({
    recipientName,
    eventName,
    eventDate,
    eventTime,
    eventLocation,
    organizerName,
}: any) => (
    <html lang="en">
        <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
                {`
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f0f4f8; /* Match EmailTemplate background */
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        font-size: 36px;
                        font-weight: bold;
                        color: #007bff; /* Match EmailTemplate logo color */
                    }
                    .email-title {
                        font-size: 28px;
                        font-weight: bold;
                        text-align: center;
                        color: #333;
                        margin: 20px 0;
                    }
                    .content {
                        font-size: 16px;
                        line-height: 1.6;
                        color: #555;
                        margin: 20px 0;
                        text-align: center;
                    }
                    .details {
                        border-top: 2px solid #007bff; /* Match EmailTemplate button color */
                        padding-top: 10px;
                        margin-top: 10px;
                    }
                    .details p {
                        margin: 0;
                    }
                    .footer {
                        text-align: center;
                        font-size: 14px;
                        color: #888;
                        margin-top: 20px;
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
                    @media (max-width: 600px) {
                        .email-container {
                            padding: 10px;
                        }
                    }
                `}
            </style>
        </head>
        <body>
            <div className="email-container">
                <div className="header">
                    Event Ticket
                </div>
                <h1 className="email-title">You're Invited!</h1>
                <div className="content">
                    <p>Dear <strong>{recipientName}</strong>,</p>
                    <p>We are excited to inform you that your ticket for the upcoming event has been successfully booked. Below are the details:</p>
                    <div className="details">
                        <p><strong>Event:</strong> {eventName}</p>
                        <p><strong>Date:</strong> {eventDate}</p>
                        <p><strong>Time:</strong> {eventTime}</p>
                        <p><strong>Location:</strong> {eventLocation}</p>
                        <p><strong>Organizer:</strong> {organizerName}</p>
                    </div>
                    <p>We look forward to seeing you at the event!</p>
                    <p>Best regards,<br />{organizerName}</p>
                </div>
                <div className="footer">
                    <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
                    <p>123 Evently Street, City, Country</p>
                </div>
            </div>
        </body>
    </html>
);

export default EventTicketEmail;
