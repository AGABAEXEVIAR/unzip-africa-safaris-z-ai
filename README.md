
## Email Integration Notes

Transactional emails are sent via Resend. See `.env.example` for the required
environment variables. The sender domain must be verified in Resend — use a
SUBDOMAIN (e.g. `mail.unzipafrica.com`) so the existing Hostinger mailbox MX
records on the apex domain are not affected.
