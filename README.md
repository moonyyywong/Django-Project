# Django-Project

## Up and Running
Assume Django and Python has been installed.

```
$ python manage.py runserver
```
Go to http://127.0.0.1:8000/.

You may add/delete/modify JSON metafiles found in `/metafiles` in the following format:
```json
[
  {
    "date": "Dec 1, 2015 13:10:59",
    "filename": "virus2.exe",
    "action": "files-deleted",
    "submit-type": "FG300B3910602113/root", 
    "rating": "malicious"
  },
  {
    "date": "Mar 12, 2015 13:12:59",
    "filename": "safe2.exe",
    "action": "files-added",
    "submit-type": "FG300B3910602113/root", 
    "rating": "clean"
  }
]
```
`date` must be in the format as shown above, with no leading zero in day of month or hour.

`rating` is one of `malicious`, `high-risk`, `medium-risk`, `low-risk` or `clean`.
