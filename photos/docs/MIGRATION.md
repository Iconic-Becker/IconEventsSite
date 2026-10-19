# Migrating from CloudSpot

Goal: every gallery moved over with its title, date and album structure,
clients who still use old links resent new ones, then CloudSpot cancelled.
About 100 GB, 1 to 2 galleries a month of history.

## 1. Export from CloudSpot

CloudSpot has no photographer-side "export my whole account" button in its
help articles (checked 2026-10-19 at help.cloudspot.io). What exists:

- **Client-side full gallery download.** With downloads enabled in the
  gallery's settings (Gallery Download Settings: turn on free downloads and
  pick Original size; Specific Folders tab to include every folder), the
  download icon at the top right of the gallery downloads the whole
  gallery, one folder, or a favorites list as zips. Full resolution
  downloads need a paid plan, which you still have.
- **Instant Download zip link.** From a collection, send yourself a zip
  link at full resolution with no download limit.

Steps per gallery:

1. Open the gallery in CloudSpot's admin. Note its **title**, **event
   date** and the **folder names** (a screenshot of the folder list is
   enough).
2. Make sure downloads are on at **Original** size for all folders.
3. Open the client link, use the download icon, choose the whole gallery.
   CloudSpot delivers one or more zips, usually one per folder.
4. Unzip into a local folder named after the gallery, with one subfolder
   per CloudSpot folder (recreate the folders if the zips flattened them).
   Keep the original filenames.
5. Also download any **videos or reels** you had attached; put event
   trailers in the gallery folder root, they will be featured in the next
   step.

Your own Lightroom exports are an equally good source if you still have
them: the edited JPEGs are what CloudSpot had.

Do all galleries before cancelling. Large downloads from CloudSpot are
sensitive to network interruptions; if a zip will not open, download that
folder again.

## 2. Upload to Iconic Photos

For each gallery:

1. Admin, **New gallery**, the original title and event date.
2. Drop the gallery folder on the Photos tab. Subfolders become albums.
   Keep the tab open until "Uploaded N files". Processing finishes in the
   background; a 2,000 photo gallery takes about 15 to 20 minutes.
3. Reels tab: drop any trailer there so it gets a share page.
4. Design tab: pick a cover photo and layout (or leave the defaults).
5. Settings: set a password if the CloudSpot gallery had one.
6. **Copy link** and paste it into the mapping sheet.

For a very large archive, `node scripts/api-upload.mjs` uploads a folder
from a computer without a browser tab open; see its header for usage.

## 3. Mapping sheet

Keep `migration-map.csv` (not in git) with one row per gallery:

```
CloudSpot gallery,Event date,Client contact,Old CloudSpot link,New link,Photos in CloudSpot,Photos in Iconic Photos,Password,Resent on
Smith Gala,2026-09-12,jane@smith.org,https://....cloudspot.io/...,https://photos.iconic.events/smith-gala-x7k2qd,412,412,,
```

CloudSpot links die when the subscription ends. For each client still
using one, send the new link (the email template below) and record the
date.

> Subject: Your photos have a new home
>
> Your event photos are now at the link below. Same photos, same albums,
> and favorites and downloads work as before. The old link will stop
> working on [date].
>
> [new link]
>
> Iconic Events

## 4. Spot check

For each gallery, compare the photo count shown in CloudSpot with the count
on the gallery list in the admin. They must match. If a gallery is short,
drop the folder again: the uploader skips files already present and adds
only the missing ones.

## 5. Cancel CloudSpot

After every row in the mapping sheet has matching counts and the clients
who needed it have the new link, cancel the subscription. Keep the local
export until the first R2 backup is confirmed (see README, Backups).
