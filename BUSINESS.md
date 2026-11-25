# ServiceFlow SA

> **One-line pitch:** ServiceFlow SA gives independent barbers, braiders and nail
> techs a simple booking link, so clients book a time slot instead of waiting in a
> queue, and providers stop losing money to walk-aways, double-bookings and buried
> WhatsApp messages.

**Live app:** https://serviceflow-sa.vercel.app/ | **Repo:** https://github.com/analystmodikwe/serviceflow-sa

## 1. The problem
I saw this problem in my own community. Jahman is a barber who takes bookings over
WhatsApp, and many of his customers simply walk in. Some sit and wait for an hour
for a haircut, and most of them eventually leave. Every customer who walks out is
money lost for him, and a customer who has wasted an hour is less likely to come
back.

He is not alone. Independent barbers, braiders, nail techs and mobile service
providers run their diaries on WhatsApp chats, phone calls and paper. That causes:
- Walk-aways when the wait is long and nobody knows how long it will be
- Double-bookings and forgotten appointments
- No-shows with no way to follow up
- Hours lost to back-and-forth about prices and times
- No record of clients, repeat customers or income

Clients have the same problem from the other side: they cannot see when a provider
is free, so they either queue or give up.

## 2. The customer
**Primary customer:** the independent provider (1 to 3 chairs, home-based or a small
shop) who takes bookings by WhatsApp, phone or walk-in.
**Secondary users:** their clients, who want to book from a phone in under a minute.
**Launch focus:** barbers and beauty providers, starting with Jahman's shop.

## 3. The solution
Each provider gets a profile, a list of services (price and duration), weekly
working hours and one booking link. Clients open the link, pick a service and an
open time slot, and book. The provider confirms or declines from a dashboard.
The database refuses overlapping bookings, so a slot can never be sold twice.
An admin verifies providers and can suspend them.

**Built and live today:** sign-up and login with three roles (customer, provider,
admin), provider profile, services and availability, slot generation, browse and
search, booking and cancellation, a provider dashboard with confirm/decline, an
admin dashboard, permission rules enforced in the database (Row Level Security),
automated tests and CI on every pull request.

**Next:** a walk-in queue board for shops like Jahman's, WhatsApp reminders, and
online deposits.

## 4. Impact
- **Providers:** fewer walk-aways and no-shows, no double-bookings, less time spent
  on WhatsApp messages, and a record of clients and bookings.
- **Customers:** no more long waits; they book a time that suits them and turn up.

**How I will measure it (pilot with Jahman):** for two weeks before and two weeks
after, count walk-aways and no-shows, the share of bookings made through the link,
and repeat customers.

## 5. Business model
- **Free plan:** a limited number of bookings per month, so any provider can start
  at no cost.
- **Pro plan:** roughly R99 a month (range to test: R79 to R149) for unlimited
  bookings, reminders and a client list.
- **Later:** optional booking deposits with a small fee per transaction.

*Illustration:* 200 paying providers at R99 a month is R19,800 a month. The prices
are hypotheses I will test with providers like Jahman. Billing is not built yet.

## 6. Go-to-market
1. **Pilot at one shop:** set up Jahman's profile and put a QR code at the door and
   chair: "Skip the wait, scan to book." Share his link on his WhatsApp status.
2. **Neighbouring barbers:** onboard in person, using Jahman's results as proof.
3. **Word of mouth by design:** every provider shares their own link, so each
   booking introduces ServiceFlow to a new set of clients.
4. **Expand by category:** braiders, nail techs, then mobile services such as car
   wash and tutoring.

## 7. Competitors
| Competitor | What they do | Gap ServiceFlow SA fills |
|---|---|---|
| Fresha | Salon scheduling, payments and marketing | Built for salons; heavy for a solo provider |
| Booksy | All-in-one booking and business management, paid plans | Salon and barber focus; more than a solo provider needs |
| Haircut Now | Free barber booking app | Barbers only |
| WhatsApp and paper diaries | What most providers use today | No availability view, no reminders, easy to double-book, no queue visibility |

**Our edge:** simple, mobile-first and free to start, built around the link a
provider already shares on WhatsApp, and open to any independent service provider.

## 8. Why me
I am an AI full-stack developer with a background in data analytics (SQL, Power
BI, Python), so I can build the product and measure whether it works. I saw this
problem at a real barber's shop and built the full system myself: database rules,
tests, CI and the interface. I will pilot it with Jahman first.