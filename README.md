# ZINC - Recursive acronym to Zinc Is No Cheating
### Discover the relationship status of Facebook profiles.
# How to run
Create a file called `.env`, copy, paste and fill this keys:

```bash
USER_FBID= #your facebook login
USER_FBPASS= #your facebook password
GMAIL_SENDER= #(optional) put a gmail account if you want to receice a email with the link of single profiles
GMAIL_PASS= #(optional) put your gmail password
PROFILES= #string separated by quotes with the profiles that you want to be notified. Example: 'loremipsum,johndoe'
EMAIL_NOTIFICATION= #(optional) the email that will receive the list of single profiles
```

After that, just `npm start`
