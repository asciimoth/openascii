import json
import os
import shutil
import subprocess
from pathlib import Path
from cleaner import cleanup, IGNORE

DIRINFO = {}

def jsoncmd(cmd):
    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        check=True,
    )
    return json.loads(result.stdout)

def copy_index():
    for root, dirs, _ in os.walk("."):
        dirs[:] = [d for d in dirs if d not in IGNORE]
        index = os.path.join(root, "index.html")
        print("create", index)
        shutil.copyfile("./index_template.html", index)

def generate_casts():
    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in IGNORE]
        for file in files:
            if not file.endswith('.3a'):
                continue
            src = os.path.join(root, file)
            dst = os.path.join(root, file.removesuffix(".3a")+".cast")
            print(f"gen {src} -> {dst}")
            with open(dst, 'w') as f:
                subprocess.run(["aaa", "convert", src, "to-cast"], stdout=f, text=True)

def get_info(file):
    data = jsoncmd(["aaa", "convert", file, "to-json"])
    del data["frames"]
    del data["extra-blocks"]
    del data["attached"]
    del data["header"]["palette"]
    return data

def get_comment(file):
    last = None
    with open(file,"r") as f:
        for line in f:
            if line.strip() == "":
                break
            if line.startswith(";;"):
                last = line.removeprefix(";;").strip()
                continue
            last = None
    return last

def get_files(dir, files = None):
    if files is None:
        files = []
    def same(a, b):
        if a.get("name") != b.get("name"):
            return False
        if "sec" in a and "sec" in b and a.get("sec") != b.get("sec"):
            return False
        if "path" in a and "path" in b and a.get("path") != b.get("path"):
            return False
        if "type" in a and "type" in b and a.get("type") != b.get("type"):
            return False
        return True
    def add(e):
        for f in range(len(files)):
            # print(files[f], e, same(files[f], e))
            if same(files[f], e):
                files[f] = e | files[f]
                return
        files.append(e)

    global DIRINFO
    DIRINFO[dir] = {"authors": set(), "origs": set()}

    content = [e for e in os.listdir(dir) if e not in IGNORE]
    content.sort()

    # mans
    for f in content:
        ff = os.path.join(dir, f)
        if not os.path.isfile(ff):
            continue
        base, ext = os.path.splitext(f)
        if ext != ".html":
            continue
        sec = 0
        name = ""
        try:
            parts = base.split('_')
            sec = str(int(parts[-1]))
            name = '_'.join(parts[:-1])
        except:
            pass
        if sec == 0:
            continue
        add({
            "name": name,
            "type": "man",
            "sec": sec,
            "path": ff.removeprefix("."),
        })

    # dirs
    for d in content:
        dd = os.path.join(dir, d)
        if not os.path.isdir(dd):
            continue
        e = {
            "name": d,
            "type": "dir",
        }
        authors = DIRINFO[dd]["authors"]
        origs = DIRINFO[dd]["origs"]
        if authors:
            e["authors"] = list(authors)
            DIRINFO[dir]["authors"] = DIRINFO[dir]["authors"].union(set(authors))
        if origs:
            e["origAuthors"] = list(origs)
            DIRINFO[dir]["origs"] = DIRINFO[dir]["origs"].union(set(origs))
        add(e)

    # art
    for f in content:
        ff = os.path.join(dir, f)
        if not os.path.isfile(ff):
            continue
        base, ext = os.path.splitext(f)
        if ext != ".3a":
            continue
        info = get_info(ff)
        e = {
            "name": base,
            "type": "file",
            "title": info["header"]["title"],
            "preview": base+".cast",
            "cols": info["meta"]["width"],
            "rows": info["meta"]["height"],
            "data": ff.removeprefix("."),
        }
        tags = info["header"]["tags"]
        if len(tags) > 0:
            e["tags"] = " ".join(map(lambda x: "#"+x, tags))
        comment = get_comment(ff)
        if comment:
            e["comment"] = comment
        if info["header"]["license"]:
            e["license"] = info["header"]["license"]
        if info["header"]["src"]:
            e["src"] = info["header"]["src"]
        authors = info["header"]["authors"]
        origs = info["header"]["orig-authors"]
        if authors:
            e["authors"] = authors
            DIRINFO[dir]["authors"] = DIRINFO[dir]["authors"].union(set(authors))
        if origs:
            e["origAuthors"] = origs
            DIRINFO[dir]["origs"] = DIRINFO[dir]["origs"].union(set(origs))
        if info["meta"]["frames"] < 2:
            e["animation"] = False
        add(e)
    return files

def generate_files():
    for root, _, files in os.walk(".", topdown=False):
        if set.intersection(set(Path(root).parts), IGNORE):
            continue
        out = os.path.join(root, "files.json")
        print("collecting", out)
        templ = []
        try:
            with open(os.path.join(root, "files_templ.json"), 'r') as f:
                templ = json.load(f)
        except:
            pass
        with open(out, 'w') as f:
            json.dump(get_files(root, templ), f, indent=2)

if __name__ == "__main__":
    cleanup()
    copy_index()
    generate_casts()
    generate_files()

