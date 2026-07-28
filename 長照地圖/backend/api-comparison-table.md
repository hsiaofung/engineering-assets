# API Comparison Table Template
- Use this template when evaluating APIs for your project. Fill in 2–3 options, compare them
side by side, and pick the one that best fits your MVP strategy.

## Comparison Table
| Criteria | API Option 1 | API Option 2 | API Option 3 |
|----------|--------------|--------------|--------------|
Name
Website
Core feature you need
| Free tier  | Yes / No
| Free tier daily limit | example: 50 requests/day
| Rate limit | example: 1 request/sec
| Paid plan starting price | example: $9/month
| Paid plan limits | example: 500 requests/day
| Caching allowed? | Yes / No / Time limit
| Data quality | Good / Average / Poor
| Data size | example: 500K+ recipes
| Documentation quality | Good / Average / Poor
| Known complaints | Check reviews, Reddit, forums
| Terms of Service concerns | Restrictions on storage, display, attribution?

## Decision Questions
After filling in the table, answer these:
1. Does your app have guest users (not signed in)?    
If yes → you need a free tier or a way to limit unauthenticated usage. You can’t pass API costs to users who haven’t created an account.    

2. Does your app have premium users (signed in)?    
If yes → you can use paid API tiers more confidently, since you know who’s using your app and can tie costs to accounts.    

3. What features could you limit for free users?
Think about which API calls are expensive and could be reserved for premium users. For example: free users get basic search, premium users get detailed recipe breakdowns.    

4. What happens when you hit the limit?
Does the API return an error? Does it silently stop working? Does it charge you automatically?   
Know this before you build.

## Example: Filled in (from the course)
| Criteria | Spoonacular | Edamam | TheMealDB |
|----------|-------------|--------|-----------|
| Core feature | Search by ingredients | Search by ingredients | Search by name only |
| Free tier | Yes (50 pts/day) | Yes (10K calls/month) | Yes (unlimited) |
| Rate limit | 1 req/sec (free) | 10 req/min (free) | None listed |
| Paid plan | From $9/month | From $5/month | One-time $3 |
| Caching | 1 hour max | Not specified | Not specified |
| Data quality | Good | Good | Average |
| Data size | 800K+ recipes | 2.3M+ recipes | ~300 recipes |
| Documentation | Good | Average | Basic |
| Known complaints | Some missing fields | Complex auth setup | Very small dataset |
| ToS concerns | Must attribute | Must attribute | None |

Decision: Spoonacular — best balance of data quality, features, and documentation for an MVP.The free tier is tight but workable for development and early testing.

Tip: Always test the API yourself before committing. Sign up for the free tier, make a few real calls, and check the actual data you get back. Documentation can promise one thing; the real response might surprise you.