---
title: Building for change, not just scale
date: 2026-09-20
description: about the small engineering decisions that keep systems understandable as they grow.
---

# Building for change, not just scale

The most useful systems are not only fast under load. They make the next change easier to reason about.

In practice, that means being deliberate about boundaries: what a service owns, what an event promises, and where a new requirement should land. Those choices are less flashy than a benchmark, but they determine whether a team can safely move when the product changes.

I keep returning to one question: can someone new to this system identify the right next step without reverse-engineering its history? Good defaults, observable behavior, and small interfaces are ways of answering yes.
