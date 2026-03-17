You are adding a new Accelerator client to the mytwenties.app portal.

Ask the user for the following details (ask all at once, not one by one):
1. Client's full name
2. Client's email address
3. Program start date (default: today)

Once you have the details, do the following using the Supabase service role key from the 3rd Path Portal memory (project URL: https://pwizfvmnixdwtzbsllui.supabase.co):

**Wait — mytwenties uses its own Supabase project.** Read the `.env.local` file in `/Users/samobrien/Documents/02 my-twenties/` to get the correct `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

### Step 1: Check if user already exists
Query `mytwenties_users` by email. If they exist, skip to Step 2b.

### Step 2a: Create user (if new)
Insert into `mytwenties_users`:
- `first_name`: their first name
- `email`: their email (lowercase)
- `tier`: 'accelerator'
- `program_start_date`: the date provided

### Step 2b: Update existing user
Update `mytwenties_users` where email matches:
- Set `tier` = 'accelerator'
- Set `program_start_date` = the date provided (only if not already set)

### Step 3: Confirm
Tell the user:
- The client's name and email
- Their program start date
- That the client can now go to mytwenties.app/login, enter their email, and access /portal
- Remind the user they can seed assets anytime by pasting a session transcript

Use curl with the Supabase REST API to make these changes. The endpoint format is:
```
curl -X POST "https://<supabase-url>/rest/v1/mytwenties_users" \
  -H "apikey: <service-role-key>" \
  -H "Authorization: Bearer <service-role-key>" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  -d '{"first_name": "...", "email": "...", "tier": "accelerator", "program_start_date": "YYYY-MM-DD"}'
```

For updates use PATCH with `?email=eq.<email>`.
