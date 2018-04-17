/**
 * Created by michelcojocaru on 12/04/2018.
 */

Requirements:
mongodb + rw rights to access /data/db
(I packed all the modules so it should be good to run after extraction). =>
=> If the setup does not work contact me at: michel.cojo@gmail.com

Setup commands:

sudo mongod
cd url-shortener
node app.js
(in a separate terminal) mongo
access from chrome browser: http://localhost:3000/

Test commands:
Press GET without inserting anything in the text field => 200 (Ok), keys (as integers)
Insert one of the keys in the text field and press GET => 301 (Moved permanently), link
Insert link in the text field and press POST => 201 (Created), id
Insert a bad link and press PUT or POST => 400 (Bad request), error in url
Insert a new url and press PUT => 404 (Not found)
Empty text field and press DELETE => 204 (No content)
Insert an id (which was not previously used) in the text field and press DELETE => 404 (Not found)

**NOTE!!
I followed exactly the table from the assignment description.


