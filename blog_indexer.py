#!/usr/bin/env python3

import os
import json

if __name__ == "__main__":
	fp = open("indexer-config.json", "r")
	indexer_config = json.load(fp)
	fp.close()

	notebooks = {"notebooks":[]}
	for notebook_name in indexer_config["indexed_categories"]:
		notebook = {"notebook_name": notebook_name, "categories": []}
		categories = os.listdir(notebook_name)
		categories.sort()
		for category_name in categories:
			category = {"category_name": category_name, "notes": []}
			notes = os.listdir(notebook_name + "/" + category_name)
			notes.sort()
			for note_name in notes:
				category["notes"].append(note_name)
			notebook["categories"].append(category)
		notebooks["notebooks"].append(notebook)
		current_path = ""

	indexer_out = json.dumps(notebooks, ensure_ascii=False)
	fp = open("indexed.json", "w")
	fp.write(indexer_out)
	fp.close()
