#!/bin/sh
# Build OpenReplicant's research site into OUT (default dist/research), served under /research.
#
# The site's code and its data both come from Morphogen at the commit in research/morphogen.ref: the kit in its
# site/, the claims, catalog and research agent's files in demos/research-loop. They are checked out into
# research/morphogen/ (ignored by git) unless that folder is already there (the deploy workflow checks it out with
# actions/checkout), and the build stops if the checkout is at another commit. research/site.toml says what to read
# and how the site looks; research/content/ holds our own pages.
set -eu

HERE=$(cd "$(dirname "$0")" && pwd)
OUT=$(mkdir -p "${1:-$HERE/../dist/research}" && cd "${1:-$HERE/../dist/research}" && pwd)
BASE=${RESEARCH_BASE:-/research}
REF=$(tr -d ' \n' < "$HERE/morphogen.ref")
SRC="$HERE/morphogen"

if [ ! -d "$SRC/.git" ] && [ ! -f "$SRC/.git" ]; then
  git init -q "$SRC"
  git -C "$SRC" remote add origin https://github.com/OpenReplicant/Morphogen.git
fi
if [ "$(git -C "$SRC" rev-parse HEAD 2>/dev/null || true)" != "$REF" ]; then
  if [ -n "${CI:-}" ]; then echo "research/build.sh: research/morphogen is not at $REF" >&2; exit 1; fi
  git -C "$SRC" fetch -q --depth 1 origin "$REF"
  git -C "$SRC" -c advice.detachedHead=false checkout -q --detach FETCH_HEAD
fi

cd "$SRC/site"
npm ci --no-audit --no-fund
MORPHOGEN_SITE_CONFIG="$HERE/site.toml" MORPHOGEN_SITE_OUT="$OUT" MORPHOGEN_SITE_BASE="$BASE" npm run build

# The kit has no external navigation, so the two links back to openreplicant.com and to MetaSoar's experiments are
# added to the header afterwards.
find "$OUT" -name '*.html' -exec perl -0pi -e '
  s{(<nav aria-label="Site"><ul>.*?)</ul></nav>}{$1<li><a href="/">openreplicant.com</a></li><li><a href="https://github.com/OpenReplicant/MetaSoar/blob/main/docs/experiments.md">MetaSoar experiments</a></li></ul></nav>}s;
' {} +
echo "research site: $OUT (Morphogen $REF)"
