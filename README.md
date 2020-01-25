Send emails to a list the easy way
--------

**Functional resources**
- Import a list in CSV and relate it to a tag;
- Send message to one or more tags;
- List subscribers in one or more tags;
- Viewing the shipping progress (completed / not completed);

**Non-functional resources**
- Use Amazon SES ($ 1 - 10,000);
- Using MongoDB;
- Use Express;
- Use messaging service (Redis);

**Business rules**
- On import, if the tag does not exist, it must be created;
- On import, if the user already exists, we will only serve it with the tag;
- The import must allow multiple tags;

## Running on Docker
### Requirements
- Docker >= 19.03.5
- Docker Compose >= 1.25.0

Runs `source dev.sh` for help (OS Unix based).
