# Constitution

*A working agreement for how we write, review, and maintain code together.*

---

## Preamble

We, the contributors to this project, establish this constitution to build software we are proud of and that the next person can understand.

Three beliefs underpin everything that follows:

1. **Code is read far more often than it is written.** We optimize for the human who reads it next — often a future version of ourselves.
2. **The codebase belongs to the team, not to individuals.** Anyone may touch any file. With that freedom comes the duty to leave it in good shape.
3. **Rules serve the work, not the other way around.** When a rule here stops helping, we amend it rather than quietly ignore it.

The articles below are grouped into how we write code (I–IX) and how we work together (X–XV).

---

### Article I — Clarity Over Cleverness
Write to be understood, not to impress. A clever one-liner that takes a teammate five minutes to decode is a liability, not an achievement. Prefer the obvious solution. When cleverness is genuinely unavoidable — a performance-critical path, a tricky algorithm — leave a comment explaining why.

### Article II — Consistency Is Law
A consistent codebase following a merely "okay" convention beats an inconsistent one that mixes several "better" ones. Match the style of the code around you. Personal preference yields to the established pattern. Anything a tool can decide — formatting, import order, spacing — is decided by the tool, not by debate (see Article XV).

### Article III — Names Carry Meaning
Names are the cheapest documentation we have, so we spend on them. Use intention-revealing, pronounceable, searchable names. A good name answers *why this exists* and *what it does*. Avoid vague catch-alls (`data`, `info`, `manager`, `temp`), cryptic abbreviations, and single letters except short-lived loop indices. Booleans read as assertions: `isReady`, `hasPermission`, `shouldRetry`.

### Article IV — Small and Single-Purpose
A function does one thing. A module or class has one reason to change. If you need the word "and" to describe what something does, it is probably doing too much — split it. Small, well-named units are self-documenting and easy to test in isolation.

### Article V — Simplicity and YAGNI
Build for the requirements in front of you, not the ones you imagine. Avoid speculative generality and premature abstraction; "You Aren't Gonna Need It" until you actually do. The simplest thing that works is the right thing until proven otherwise. Delete dead code rather than commenting it out — version control already remembers.

### Article VI — Don't Repeat Yourself, Within Reason
Duplicated *knowledge* is a bug: one fact should have one home. But abstraction has a price, and the wrong abstraction is costlier than a little duplication. Follow the Rule of Three — extract shared logic on the third occurrence, once the real pattern is clear, not on the first.

### Article VII — Explicit Over Implicit
Make dependencies, side effects, and assumptions visible. Avoid hidden global state and "magic" that acts at a distance. A reader should be able to tell what a function needs and what it changes from its signature, not by spelunking through the call stack.

### Article VIII — Errors Are Handled Deliberately
Fail fast and loudly in development; degrade gracefully in production. Never swallow an exception silently. Validate inputs at system boundaries and trust them inside. The error path is real code and deserves the same care as the happy path.

### Article IX — Comments Explain Why
Code shows *what* and *how*; comments explain *why*. Don't narrate the obvious. Do capture non-obvious decisions, trade-offs, workarounds, and links to the issue or discussion that gave them context. A comment that has drifted out of sync with the code is worse than none — keep them honest or delete them.
