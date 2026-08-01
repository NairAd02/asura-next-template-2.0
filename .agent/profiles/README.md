# Project profiles

Profiles compose the core `.agent` conventions with optional stack addons. They do not install packages or activate runtime behavior. Select a profile only when its stack is requested or evidenced by the repository.

`nextjs-prisma-postgresql.md` is the initial optional profile. Future addons such as authentication or payments should add their own profile composition instead of copying the core skills.
