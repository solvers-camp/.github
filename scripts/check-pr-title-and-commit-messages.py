#!/usr/bin/env python3
import os
import re
import sys
import time

import requests

# Use the same regex for PR title and commit messages for now
title_regex = r'^(([a-zA-Z\-_.]+:\s)?)T\d+:\s+[^\s]+.*'
commit_regex = title_regex

def add_pr_comment(pr_url, message):
    comments_url = f"{pr_url}/comments"
    headers = {
        'Authorization': f"token {os.getenv('GH_TOKEN')}",
        'Accept': 'application/vnd.github.v3+json',
    }
    data = {
        'body': message,
    }
    print ( f"url : {pr_url} message : {message}") 


    response = requests.post(comments_url, headers=headers, json=data)
    print ( f"Afer post")     
    response.raise_for_status()

def check_pr_title(pr_url,title):
    if not re.match(title_regex, title):
        message = f"PR title '{title}' does not match the required format! Valid title example: T99999: make IPsec secure"
        print(message)
        print("Before add comment")
        add_pr_comment(pr_url, message)  
        print("After add comment")      
        # print("PR title '{}' does not match the required format!".format(title))
        # print("Valid title example: T99999: make IPsec secure")
        sys.exit(1)

def check_commit_message(pr_url,title):    
    if not re.match(commit_regex, title):
        message = f"Commit title '{title}' does not match the required format! Valid title example: T99999: make IPsec secure"
        print(message)
        print("Before pr comment")        
        add_pr_comment(pr_url, message)      
        print("After pr comment")   
        # print("Commit title '{}' does not match the required format!".format(title))
        # print("Valid title example: T99999: make IPsec secure")       
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Please specify pull request URL!")
        sys.exit(1)

    # There seems to be a race condition that causes this scripts to receive
    # an incomplete PR object that is missing certain fields,
    # which causes temporary CI failures that require re-running the script
    #
    # It's probably better to add a small delay to prevent that
    time.sleep(5)

    # Get the pull request object
    pr = requests.get(sys.argv[1]).json()
    if "title" not in pr:
        print("The PR object does not have a title field!")
        print("Did not receive a valid pull request object, please check the URL!")
        sys.exit(1)

    check_pr_title(pr["title"])

    # Get the list of commits
    commits = requests.get(pr["commits_url"]).json()
    for c in commits:
        # Retrieve every individual commit and check its title
        co = requests.get(c["url"]).json()
        check_commit_message(co["commit"]["message"])

#!/usr/bin/env python3

import re
import sys
import time

import requests

# Use the same regex for PR title and commit messages for now
title_regex = r'^(([a-zA-Z\-_.]+:\s)?)T\d+:\s+[^\s]+.*'
commit_regex = title_regex

def check_pr_title(title):
    if not re.match(title_regex, title):
        print("PR title '{}' does not match the required format!".format(title))
        print("Valid title example: T99999: make IPsec secure")
        sys.exit(1)

def check_commit_message(title):
    if not re.match(commit_regex, title):
        print("Commit title '{}' does not match the required format!".format(title))
        print("Valid title example: T99999: make IPsec secure")
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Please specify pull request URL!")
        sys.exit(1)

    # There seems to be a race condition that causes this scripts to receive
    # an incomplete PR object that is missing certain fields,
    # which causes temporary CI failures that require re-running the script
    #
    # It's probably better to add a small delay to prevent that
    time.sleep(5)

    # Get the pull request object
    pr = requests.get(sys.argv[1]).json()
    if "title" not in pr:
        print("The PR object does not have a title field!")
        print("Did not receive a valid pull request object, please check the URL!")
        sys.exit(1)

    check_pr_title(pr["title"])

    # Get the list of commits
    commits = requests.get(pr["commits_url"]).json()
    for c in commits:
        # Retrieve every individual commit and check its title
        co = requests.get(c["url"]).json()
        check_commit_message(co["commit"]["message"])
