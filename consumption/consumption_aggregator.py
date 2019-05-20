#!/usr/bin/python

import datetime
import psycopg2

import consumption_util

MINUTES_INTERVAL = 5

def main():
    now = datetime.datetime.now()

    print '\n\n***********************************'
    print 'starting aggregation at', now

    (conn, cur) = consumption_util.get_db_connection()

    cur.execute("SELECT timestamp FROM consumption_realtime ORDER BY timestamp DESC LIMIT 1")
    value = cur.fetchone()

    if value:
        timestamp = value[0].tzinfo
        now = datetime.datetime(now.year, now.month, now.day, now.hour, now.minute, 0, 0, tzinfo = timestamp)
    else:
        print 'Nothing on the database, exiting...'
        return 0


    cur.execute("SELECT ambient_id, slave_id FROM ambients_rfir_slaves_rel")
    values = cur.fetchall()

    consumption_util.close_db_connection(conn, cur)

    ambientMap = {}
    slaveSet = set()

    for (ambientId, slaveId) in values:
        slaveList = ambientMap.get(ambientId, [])
        slaveList.append(slaveId)
        ambientMap[ambientId] = slaveList
        slaveSet.add(slaveId)

    slaveList = list(slaveSet)

    print now
    print 'ambientMap', ambientMap
    print 'slaveList', slaveList

    start = now - datetime.timedelta(minutes = MINUTES_INTERVAL)
    consumption_util.realtime_aggregation(start, now, slaveList)
    consumption_util.aggregate_ambients(start, 'minute', ambientMap)
    consumption_util.aggregate_all(start, 'minute')

    if now.minute == 0:
        # also aggregate hourly
        start = now - datetime.timedelta(hours = 1)
        numPoints = 60/MINUTES_INTERVAL
        consumption_util.aggregate_slaves(start, now, 'minute', 'hour', numPoints)
        consumption_util.aggregate_ambients(start, 'hour', ambientMap)
        consumption_util.aggregate_all(start, 'hour')
    else:
        return 0

    if now.hour == 0:
        # also aggregate daily
        start = now - datetime.timedelta(days = 1)
        numPoints = 24
        consumption_util.aggregate_slaves(start, now, 'hour', 'day', numPoints)
        consumption_util.aggregate_ambients(start, 'day', ambientMap)
        consumption_util.aggregate_all(start, 'day')
        # and delete old entries once daily
        consumption_util.delete_old()
    else:
        return 0

    if now.day == 1:
        # also aggregate monthly
        start = now
        if now.month == 1:
            start = datetime.datetime(now.year - 1, 12, 1, 0, 0, 0, 0, tzinfo = timestamp)
        else:
            start = datetime.datetime(now.year, now.month - 1, 1, 0, 0, 0, 0, tzinfo = timestamp)
        numPoints = (now - start).days
        consumption_util.aggregate_slaves(start, now, 'day', 'month',  numPoints)
        consumption_util.aggregate_ambients(start, 'month', ambientMap)
        consumption_util.aggregate_all(start, 'month')
    else:
        return 0

    if now.month == 1:
        # also aggregate yearly
        start = datetime.datetime(now.year - 1, 1, 1, 0, 0, 0, 0, tzinfo = timestamp)
        numPoints = 12
        consumption_util.aggregate_slaves(start, now, 'month', 'year', numPoints)
        consumption_util.aggregate_ambients(start, 'year', ambientMap)
        consumption_util.aggregate_all(start, 'year')

if __name__ == "__main__":
    main()
