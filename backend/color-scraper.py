# web-scraper to scrape all colors from list of colors

from bs4 import BeautifulSoup
import requests
import json

headers = { 'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.42" }
url = 'https://everynoise.com/everynoise1d.cgi?vector=color&scope=all'

page= requests.get(url, headers = headers)
if page.status_code < 300:
    output = {}
    soup = BeautifulSoup(page.content, 'html.parser') # parses source code
    links = soup.find_all('a', { 'title': 'Re-sort the list starting from here.' }) # gets all links with title 'Re-sort the list starting from here.'
    for i in range(len(links)):
        output[links[i].text] = links[i]['style'][7:]
    with open("./json/genre-color.json", "w") as colors:
        json.dump(output, colors)
    print("scraped all { genre: color } pairs!")
else:
    print("REQUEST FAILED, CODE " + str(page.status_code))