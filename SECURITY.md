# Security and configuration

Report suspected credential exposure privately to the support address published
on the website. Do not paste credentials or private personal information into a
public issue, pull request, build log or screenshot.

## Private credentials

Keep API access tokens and signing keys outside version control. Use local
ignored environment files for development and the relevant provider's secret
store for CI and deployment. Grant the smallest necessary permissions. Never
put access credentials in browser code, `NEXT_PUBLIC_*` variables, public assets
or a value passed to client components. Environment variables are not secret if
their values are rendered into public output.

`.env*` and common signing-key formats are ignored. `.env.example` may contain
placeholder names and values only. Git ignore rules do not protect a file that
has already been tracked; secret detection is a separate CI gate.

If a credential is exposed, revoke or rotate it first. Investigate current files,
all relevant refs, pull requests, logs, artifacts and deployed output before
choosing history cleanup. Rewriting Git cannot revoke a credential or erase
other people's copies. Remote cleanup and history rewriting require the owner's
approval after an exact recap.

## Public integration configuration

The Apple application identifier in the universal-link association endpoint and
the Cloudflare Web Analytics browser site identifier are deliberately public.
They are not signing keys or API access tokens. Changing where those values are
configured cannot hide values required in public responses. Provider identity
and contact disclosures in legal documents are a separate privacy decision.

## Checks

CI runs a pinned, checksum-verified Gitleaks binary against checkout history
with full redaction. `.gitleaksignore` records only two exact historical public
analytics matches; `.gitleaks.toml` excludes one exact callback assignment in the
design export. Do not add broad path or credential-rule exclusions to silence a
new finding. CI also runs `pnpm audit --audit-level=high`; assess reachability in
runtime, build, test and deployment paths when triaging advisories.

For a local history scan with Gitleaks 8.30.1:

```sh
gitleaks git . --log-opts="--all" --redact=100 --no-banner
pnpm audit --audit-level=high
```

Local scans must also inspect uncommitted changes before they are staged. These
checks supplement manual review; passing them does not establish that the site
is free of vulnerabilities or private information.
