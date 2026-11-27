---
title: What we're researching, and how
description: Agents that get cheaper and better from their own experience, tested in the open. Every experiment says beforehand what would prove it wrong, and the results that went against us are published with the rest.
kind: page
nav: 10
refs:
  - trial:E-04a
  - claim:gates-likelihood-readout-27-31b-matches-jev
  - resource:inkling-2-mini-q4-k
---

## What we're researching

[MetaSoar](https://github.com/OpenReplicant/MetaSoar) is our research into agents that learn cheap habits for the
situations they meet again and again: a cognitive architecture built on Soar, and a ladder of handlers that runs a
recurring decision on the cheapest thing that gets it right, from a stored rule to a small local model to a large
one. Nothing the agent learns is used until [Morphogen](https://github.com/OpenReplicant/Morphogen)'s judge has
measured it on cases the learner never saw.

Papers report far more gains than anyone tests. Morphogen's research agent reads them for the parts of our agent,
writes each claimed gain down as a claim with the conditions it was measured under, and predicts whether it will
hold on our setup before anything is tried. This site is that catalog: the claims, the papers, our trials, the
models they ran on and the map of the system's parts, every page linked both ways.

## How we work

- **Falsifiers first.** Each experiment is registered in
  [MetaSoar's experiment register](https://github.com/OpenReplicant/MetaSoar/blob/main/docs/experiments.md) before
  it runs: what it claims, what result would show it wrong, what it needs and what it informs. The verdict is
  recorded against that falsifier, not against a story written afterwards.
- **Refutations are published.** When the falsifier is met, the result goes on this site like any other. The claim
  that small untuned models, read by their probabilities, match a decision model failed for LFM3 1.7B and held for
  Inkling 2 Mini, and both outcomes are on [the claim's page](claims/gates-likelihood-readout-27-31b-matches-jev.html)
  and [E-04a's](trials/e-04a.html).
- **Predictions are scored.** A prediction written before an outcome is scored against it on the
  [predictions page](predictions.html), so the next predictions can be calibrated.
- **Local and cheap.** Trials run on local models, such as [Inkling 2 Mini](resources/inkling-2-mini-q4-k.html), on
  hardware a small team can afford.
- **Everything is files.** Claims, the map and the research agent's queue are plain files in Morphogen's
  repository, under Apache-2.0. This site is built from them; nothing is entered by hand.

## Finding your way around

[Claims](index.html) lists every claim with its status for our system; [Next to test](queue.html) is the research
agent's queue; the [map](map.html) shows the system's parts and the options for each; [search](search.html) finds
anything. To ask a question or dispute a claim, open an issue from the claim's page.

[Back to openreplicant.com](/)
