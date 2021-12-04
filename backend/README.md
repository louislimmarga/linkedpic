# How to start the RESTFUL API server

## Steps to complete once

Within your `backend` folder in your project repo (i.e. the folder this `README.md` is in), run:

```bash
pip3 install -r requirements.txt # You only have to do this once
```

## Running the server

You complete this step every time you want to start the server.

Within your `backend` folder in your project repo (i.e. the folder this `README.md` is in), run:

```bash
python3 run.py # This will start the server, you do this each time you want it to run
```

Note: You must be using at least python 3.6.

## Other notes

* If you get "Address already in use" error, try changing the line `app.run(debug=True)` to `app.run(debug=True, port=XXXX)` with a random port number between 10000 and 50000. This line is in `run.py`
