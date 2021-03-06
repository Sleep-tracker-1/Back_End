from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.sql import select
import pandas as pd
import os
import numpy as np
from database_models.models_package import User, BedHours, Tiredness, Mood
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
import argparse


load_dotenv()

DATABASE_URL = os.getenv("PROD_DATABASE_URL")

engine = create_engine(DATABASE_URL)
connection = engine.connect()

def hours_analysis(username):
    user_id = connection.execute(select([User.id]).where(User.username == username))
    for result in user_id:
        user_id = result[0]
    bedtimes = connection.execute(select([BedHours.bedtime]).where(BedHours.user_id == user_id))
    bedtimes_list = []
    for result in bedtimes:
        bedtimes_list.append(result[0])
    bedtimes_ids = connection.execute(select([BedHours.id]).where(BedHours.user_id == user_id))
    bedtimes_ids_list = []
    for result in bedtimes_ids:
        bedtimes_ids_list.append(result[0])
    waketimes = connection.execute(select([BedHours.waketime]).where(BedHours.user_id == user_id))
    waketimes_list = []
    for result in waketimes:
        waketimes_list.append(result[0])
    morning_mood_list = []
    midday_mood_list = []
    evening_mood_list = []
    morning_tired_list = []
    midday_tired_list = []
    evening_tired_list = []
    for id in bedtimes_ids_list:
        mood = connection.execute(select([Mood.wake_mood, Mood.midday_mood, Mood.night_mood]).where(Mood.night_id == id))
        for result in mood:
            morning_mood_list.append(result[0])
            midday_mood_list.append(result[1])
            evening_mood_list.append(result[2])
        tired = connection.execute(select(
            [Tiredness.wake_tired, Tiredness.midday_tired, Tiredness.night_tired]).where(Tiredness.night_id == id))
        for result in tired:
            morning_tired_list.append(result[0])
            midday_tired_list.append(result[1])
            evening_tired_list.append(result[2])

    df = pd.DataFrame(columns=['night_id', 'bedtime', 'waketime', 'morning_mood', 'midday_mood', 'evening_mood',
                               'morning_tired', 'midday_tired', 'evening_tired'])

    for i in range(len(bedtimes_ids_list)):
        df = df.append({'night_id': bedtimes_ids_list[i], 'bedtime': bedtimes_list[i], 'waketime': waketimes_list[i],
                        'morning_mood': morning_mood_list[i], 'midday_mood': midday_mood_list[i],
                        'evening_mood': evening_mood_list[i], 'morning_tired': morning_tired_list[i],
                        'midday_tired': midday_tired_list[i], 'evening_tired': evening_tired_list[i]},
                       ignore_index=True)

    # need to create model to predict hours necessary for maximum mood/lowest tiredness
    # target is hours in bed
    # create prediction with input of mood/tiredness integers
    # train model on each user, then create prediction of hours_in_bed with all 4s for mood and 1s for tired
    df['hours_in_bed'] = (df['waketime'] - df['bedtime'])
    for column in df.columns:
      if column != 'night_id' and column != 'bedtime' and column != 'waketime':
          df[column] = df[column].fillna(df[column].mean())
      if column == 'bedtime' or column == 'waketime':
          df[column] = df[column].dropna()
    X = df.drop('hours_in_bed', axis=1)
    X = X.drop('bedtime', axis=1)
    X = X.drop('waketime', axis=1)
    X = X.drop('night_id', axis=1)
    y = df['hours_in_bed'].dt.total_seconds().astype('int')
    #model = RandomForestRegressor(n_jobs=-1, max_depth=30, min_samples_leaf = 2, min_samples_split=11, n_estimators=850)
    model = make_pipeline(PolynomialFeatures(degree=2), LinearRegression())
    model.fit(X, y)
    optimal_hours = (model.predict([[3,3,3, 1, 1, 1]])) / 3600
    morning_mood_list = [i for i in morning_mood_list if i]
    midday_mood_list = [i for i in midday_mood_list if i]
    evening_mood_list = [i for i in evening_mood_list if i]
    morning_tired_list = [i for i in morning_tired_list if i]
    midday_tired_list = [i for i in midday_tired_list if i]
    evening_tired_list = [i for i in evening_tired_list if i]
    mood_average = ((sum(morning_mood_list)/len(morning_mood_list)) + (sum(midday_mood_list)/len(midday_mood_list)) + (sum(evening_mood_list)/len(evening_mood_list))) / 3
    tired_average = ((sum(morning_tired_list)/len(morning_tired_list)) + (sum(midday_tired_list)/len(midday_tired_list)) + (sum(evening_tired_list)/len(evening_tired_list))) / 3
    averages = np.array([df['hours_in_bed'].mean().total_seconds() / 60 / 60, mood_average, tired_average]).tolist()
    return optimal_hours[0], averages[0], averages[1], averages[2]


def sleep_averages(username):
    user_id = connection.execute(select([User.id]).where(User.username == username))
    for result in user_id:
        user_id = result[0]
    bedtimes = connection.execute(select([BedHours.bedtime]).where(BedHours.user_id == user_id))
    bedtimes_list = []
    for result in bedtimes:
        bedtimes_list.append(result[0])
    bedtimes_ids = connection.execute(select([BedHours.id]).where(BedHours.user_id == user_id))
    bedtimes_ids_list = []
    for result in bedtimes_ids:
        bedtimes_ids_list.append(result[0])
    waketimes = connection.execute(select([BedHours.waketime]).where(BedHours.user_id == user_id))
    waketimes_list = []
    for result in waketimes:
        waketimes_list.append(result[0])
    morning_mood_list = []
    midday_mood_list = []
    evening_mood_list = []
    morning_tired_list = []
    midday_tired_list = []
    evening_tired_list = []
    for id in bedtimes_ids_list:
        mood = connection.execute(select([Mood.wake_mood, Mood.midday_mood, Mood.night_mood]).where(Mood.night_id == id))
        for result in mood:
            morning_mood_list.append(result[0])
            midday_mood_list.append(result[1])
            evening_mood_list.append(result[2])
        tired = connection.execute(select(
            [Tiredness.wake_tired, Tiredness.midday_tired, Tiredness.night_tired]).where(Tiredness.night_id == id))
        for result in tired:
            morning_tired_list.append(result[0])
            midday_tired_list.append(result[1])
            evening_tired_list.append(result[2])
    hours_in_bed = []
    for i in range(len(bedtimes_ids_list)):
        hours = waketimes_list[i] - bedtimes_list[i]
        hours_in_bed.append(hours.seconds / 3600)
    avg_hours_in_bed = (sum(hours_in_bed)/len(hours_in_bed))
    averages = np.array([avg_hours_in_bed, (sum(morning_mood_list) / len(morning_mood_list)),
                         (sum(midday_mood_list) / len(midday_mood_list)),
                         (sum(evening_mood_list) / len(evening_mood_list)),
                         (sum(morning_tired_list) / len(morning_tired_list)),
                         (sum(midday_tired_list) / len(midday_tired_list)),
                         (sum(evening_tired_list) / len(evening_tired_list))])
    return averages



if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Generate sleep, mood, and tiredness averages')
    parser.add_argument('username')

    args = parser.parse_args()
    print(hours_analysis(args.username))
