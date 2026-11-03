---
name: meta-capability-check
description: Check the latest Meta Model API models and tool capabilities from live docs before planning or choosing tools for Meta-related work.
---

# Meta Capability Check

Use this skill before planning, choosing a model, or designing tool calls whenever the task mentions Meta, Muse, SAM, Model API, or asks which Meta model or tool fits. Do not rely on training-data memory for versions or capabilities — fetch live sources first, then decide.

## When to trigger

- The user names Meta, Muse Wonder, Muse Spark, Muse Image, Muse Voice Transcribe, Segment Anything (SAM), Muse Spark Open, Muse Glimmer, or Model API.
- The task asks for a model recommendation, context limit, modality, endpoint, pricing tier, or tool-calling design on Meta's platform.
- Planning would otherwise assume a model ID, tool format, or capability that may have changed.

Skip the check for work with no Meta surface; do not add latency to unrelated tasks.

## Live check — do this first

1. Fetch the models page: `https://dev.meta.ai/docs/models` via `web_fetch`. Extract every model line, model ID, input/output modalities, context window, reasoning support, endpoints, and availability notes. Note preview status and country restrictions.
2. Fetch the overview: `https://dev.meta.ai/docs/overview`. Note any new product lines or renamed capabilities since the models page was written.
3. If the task involves tools, also fetch `https://dev.meta.ai/docs/tool-calling` and `https://dev.meta.ai/docs/tool-search`. Extract: function vs custom tool shapes, namespace tools, `parallel_tool_calls`, `tool_choice`, `defer_loading`, built-in `web_search` / `tool_search`, and Responses vs Chat Completions differences.
4. Fetch capability pages only as needed: `image-understanding`, `image-generation`, `speech-to-text`, `video-understanding`, `media-segmentation`, `reasoning`, `structured-output`, `search-grounding`, `file-handling`, `prompt-caching`, `token-counting` under `https://dev.meta.ai/docs/`.
5. If `MODEL_API_KEY` is set, call `GET https://api.meta.ai/v1/models` with `Authorization: Bearer $MODEL_API_KEY` and compare the returned IDs and `created` timestamps against the docs. The API list is the ground truth for what the team can actually call. If no key is set, state that the check is docs-only.
6. Record the fetch date and source URLs with every recommendation. If two sources disagree, prefer the API response, then the models page, and flag the disagreement.

If a fetch fails, say the capability is unverified — do not substitute a remembered version number.

## What to report before planning

State briefly, with sources:

- Latest recommended model ID per use case (agentic/coding, image, speech-to-text, segmentation, self-hosted) and why it fits the task.
- Context window, input/output modalities, reasoning effort levels, supported endpoints (Responses / Chat Completions / Messages), and availability limits that affect the plan.
- Tool facts that shape the design: flat (Responses) vs nested (Chat Completions) tool definitions, custom-tool restriction to Responses, one-dot function-name rule, namespace grouping for MCP-style names, and whether `tool_search` with `defer_loading` should replace an upfront tool list.
- Anything deprecated, renamed, or preview-only that the plan must not depend on without a fallback.

Then plan or call tools using those verified facts.

## Decision shortcuts (verify live before trusting)

- Long-horizon, multi-file, highest-capability agentic work → check Muse Wonder availability first.
- High-volume, latency- or cost-sensitive agentic/coding loops → check the newest Muse Spark version and its contributor variant.
- Image generation/editing → Muse Image; speech-to-text (streaming, diarization) → Muse Voice Transcribe; boxes/masks over image/video → SAM.
- Self-hosted or post-training → Muse Spark Open or Muse Glimmer; confirm hardware and license on the open-weight pages.

These shortcuts only route the live check — the fetched docs decide the final ID and parameters.
