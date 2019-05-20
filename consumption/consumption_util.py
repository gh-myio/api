#!/usr/bin/python

import os
import psycopg2
import datetime

DB_USERNAME = os.environ['DB_USERNAME']
DB_PASSWORD = os.environ['DB_PASSWORD']
DB_DATABASE = os.environ['DB_DATABASE']
DB_HOST = os.environ['DB_HOST']
DB_PORT = os.environ['DB_PORT']

def get_db_connection():
    conn = psycopg2.connect("dbname='{}' user='{}' host='{}' password='{}'".format(DB_DATABASE,
                                                                                   DB_USERNAME,
                                                                                   DB_HOST,
                                                                                   DB_PASSWORD))
    cur = conn.cursor()
    return (conn, cur)

def close_db_connection(conn, cur, commit = False):
    if commit:
        conn.commit()

    cur.close()
    conn.close()


def realtime_aggregation(start, end, slaves):
    (conn, cur) = get_db_connection()

    cur.execute("SELECT timestamp, slave_id, ambient_id, value FROM consumption_realtime WHERE timestamp >= %s AND timestamp < %s", [start, end])
    valuesInterval = cur.fetchall()
    valueMap = {}

    for (date, id, ambients, value) in valuesInterval:
        valueList = valueMap.get(id, [])
        valueList.append((date, value))
        valueMap[id] = valueList

    cur.execute("SELECT DISTINCT ON (slave_id) timestamp, slave_id, value FROM consumption_realtime WHERE timestamp >= %s - '1 hours'::interval AND timestamp < %s ORDER BY slave_id, timestamp DESC", [start, start])
    valuesBefore = cur.fetchall()

    remainingSlaves = list(slaves)

    for (date, id, value) in valuesBefore:
        if id in slaves:
            valueList = valueMap.get(id, [])
            valueList.insert(0, (start, value))
            valueMap[id] = valueList
            remainingSlaves.remove(id)

    for slaveId in remainingSlaves:
        valueMap[slaveId] = [(start, 0)]


    totalInterval = (end - start).total_seconds()

    for slaveId, valueList in valueMap.items():
        weightSum = 0
        i = 0
        while i < (len(valueList) - 1):
            (time1, value1) = valueList[i]
            (time2, value2) = valueList[i+1]
            weightSum += (value1 * (time2 - time1).total_seconds())
            i += 1

        if len(valueList) > 1:
            (lastTime, lastValue) = valueList[len(valueList) - 1]
            weightSum += (lastValue * (end - lastTime).total_seconds())

        #print(slaveId, weightSum/totalInterval)
        cur.execute("INSERT INTO consumption (timestamp, slave_id, value, type) VALUES (%s, %s, %s, %s)", [start, slaveId, weightSum/totalInterval, "minute"])
        print 'slave', start, slaveId, weightSum/totalInterval, 'minute'


    close_db_connection(conn, cur, True)


def aggregate_slaves(start, end, source, destination, numPoints):
    (conn, cur) = get_db_connection()
    cur.execute("SELECT slave_id, SUM(value) FROM consumption WHERE timestamp >= %s AND timestamp < %s AND slave_id IS NOT NULL AND type = %s GROUP BY slave_id", [start, end, source])
    values = cur.fetchall()
    #[(70, 465.38), (74, 0.0), (72, 33.4433), (73, 0.0), (71, 0.0)]
    for (slaveId, value) in values:
        cur.execute("INSERT INTO consumption (timestamp, slave_id, value, type) VALUES (%s, %s, %s, %s)", [start, slaveId, value/numPoints, destination])
        print 'slave', start, slaveId, value/numPoints, destination

    close_db_connection(conn, cur, True)


def aggregate_ambients(time, type, ambientMap):
    (conn, cur) = get_db_connection()

    for ambientId, slaveList in ambientMap.items():
        cur.execute("SELECT SUM(value) FROM consumption WHERE timestamp = %s AND slave_id IS NOT NULL AND type = %s AND slave_id in %s", [time, type, tuple(slaveList)])
        values = cur.fetchall()
        #[(498.823,)]
        for valueTuple in values:
            value = valueTuple[0]
            cur.execute("INSERT INTO consumption (timestamp, ambient_id, value, type) VALUES (%s, %s, %s, %s)", [time, ambientId, value, type])
            print 'ambient', time, ambientId, value, type

    close_db_connection(conn, cur, True)

def aggregate_all(time, type):
    (conn, cur) = get_db_connection()

    cur.execute("SELECT SUM(value) FROM consumption WHERE timestamp = %s AND slave_id IS NOT NULL AND type = %s", [time, type])
    values = cur.fetchall()
    #[(498.823,)]
    for valueTuple in values:
        value = valueTuple[0]
        cur.execute("INSERT INTO consumption (timestamp, value, type) VALUES (%s, %s, %s)", [time, value, type])
        print 'all', time, value, type

    close_db_connection(conn, cur, True)

def delete_old():
    (conn, cur) = get_db_connection()
    cur.execute("DELETE FROM consumption_realtime WHERE timestamp < now() - interval '1 days'")
    close_db_connection(conn, cur, True)

