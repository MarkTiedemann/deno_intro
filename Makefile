.PHONY: all
all:
	deno fmt make.ts
	deno --allow-read=slides --allow-write=slides,docs/index.html make.ts
