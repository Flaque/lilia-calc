import matplotlib.pyplot as plt
import numpy as np
from sklearn.linear_model import LinearRegression
import csv
from scipy import stats
from scipy.optimize import curve_fit
import scipy

def fn(x, a, b, c):
    return a + b*x[0] + c*x[1]

amhs = []
afcs = []
y = []
with open("outcomes.csv") as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        costInString = row["Med Cost"].replace("$", "").replace(",", "")
        amhInString = row["AMH"]
        afcInString = row["AFC"]

        if amhInString == "" or afcInString == "" or costInString == "":
            continue

        amhs.append(float(amhInString))
        afcs.append(float(afcInString))
        y.append(float(costInString))


    reg = LinearRegression()
    reg.fit(np.array([amhs, afcs]).T, y)

    line = reg.coef_*np.array([amhs, afcs]).T + reg.intercept_
