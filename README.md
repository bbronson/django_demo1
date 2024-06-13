# django_demo1
Django Demo ReadMe doc

Install python3

create a python virtual env with: 

python3 -m venv myproject

then run the following commands

git clone https://github.com/bbronson/django_demo1.git

pip install django

cd test_project

python3 manage.py runserver

in the test_project folder to run it. 

View it in the browser once it is running at http://127.0.0.1:8000/main/


One note of things I would have liked to do if this was in a production situation: Have a database instead of a JSON file, employ security on the BE for authentication, employ security for cleaning up inputs to prevent XSS, and adding unit tests and end to end tests.
