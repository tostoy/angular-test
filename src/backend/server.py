# This Python file uses the following encoding: utf-8

from flask_mysqldb import MySQL
from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from json import dumps
from flask_jsonpify import jsonify



app = Flask(__name__)
api = Api(app)
CORS(app)

DEBUG=True

app.config.from_object(__name__)
app.config.from_pyfile('config.cfg')

mysql = MySQL(app)


@app.route('/')
def hello():
    return jsonify({'text':'Hello World!'})

# gibt alle Knoten mit letzten Messwerten und dazugehoerigen Messzeitpunkten aus
class Nodes(Resource):
    def get(self):
        nodeList = []
        cur = mysql.connection.cursor()
        cur2 = mysql.connection.cursor()
        sql_query = "SELECT id, latitude, longitude FROM nodes;"
        cur.execute(sql_query)
        row = cur.fetchone()
        while row is not None:
            sql_query2 = ("SELECT datetime, air_humidity, " 
                     "air_pressure, air_temperature, particle_25, "
                     "particle_100 "
                     "FROM data WHERE node_id = " + str(row[0]) + " "
                     "AND datetime = (SELECT max(datetime) FROM data WHERE node_id = " + str(row[0]) + ");")
            cur2.execute(sql_query2)
            row2 = cur2.fetchone()
            if row2 is not None:
              nodeList.append({
                  'node_id': row[0],
                  'latitude': row[1],
                  'longitude': row[2],
                  'datetime': row2[0],
                  'air_humidity': row2[1],
                  'air_pressure': row2[2],
                  'air_temperature': row2[3],
                  'particle_25': row2[4],
                  'particle_100': row2[5]
              })
            row = cur.fetchone()
        return jsonify(nodeList)


# gibt alle Messwerte (stündlicher Durchschnitt, 2 Stellen nach Komma) der Messstationen aus
# gruppiert nach Datum und stündlicher Uhrzeit
class AirValues(Resource):
    def get(self):
        nodeIdList = [] # id's der Messstationen
        resultList = []
        cur = mysql.connection.cursor()
        cur.execute("SELECT id FROM nodes")
        row = cur.fetchone()
        while row is not None:
            nodeIdList.append(str(row[0]))
            row = cur.fetchone()
        # nun enthaelt nodeIdList alle Knoten Id's
        sql_query = ("SELECT node_id, "
                     "date_format(datetime, '%Y-%m-%d'), "
                     "date_format(datetime, '%H'), "
                     "ROUND(avg(air_humidity), 2), "
                     "ROUND(avg(air_pressure), 2), "
                     "ROUND(avg(air_temperature), 2), " 
                     "ROUND(avg(particle_25), 2), "
                     "ROUND(avg(particle_100), 2) "
                     "FROM data "
                     "GROUP BY node_id, date_format(datetime, '%Y%m%d%H') "
                     "order by node_id, datetime;")
        cur.execute(sql_query)
        row = cur.fetchone()
        for i in range(0, len(nodeIdList)):
            idResultList = [] # Messungen fuer Knoten i
            id = nodeIdList[i]
            while row is not None and str(row[0]) == id:
                idResultList.append({
                    'date': str(row[1]),
                    'hour': str(row[2]),
                    'air_humidity': str(row[3]),
                    'air_pressure': str(row[4]),
                    'air_temperature': str(row[5]),
                    'particle_25': str(row[6]),
                    'particle_100': str(row[7])
                })
                row = cur.fetchone()
            resultList.append({'node_id': id, 'air_value': idResultList})
        return jsonify(resultList)


class AllValues(Resource):
    def get(self, date):
        valueList=[]
        cur = mysql.connection.cursor()
        cur.execute("select * from data where datetime like '"+date+"%' ")
        row = cur.fetchone()
        while row is not None:
            valueList.append({
                'id': int(row[0]),
                'node_id': int(row[1]),
                'air_humidity': str(row[2]),
                'air_pressure': str(row[3]),
                'air_temperature': str(row[4]),
                'particle_25': str(row[5]),
                'particle_100': str(row[6]),
                'datetime': str(row[7]),
                'latitude': str(row[8]),
                'longitude': str(row[9])
            })
            row = cur.fetchone()
        return jsonify(valueList)




api.add_resource(Nodes, '/nodes') # Route_1
api.add_resource(AirValues, '/airvalues') # Route_2
api.add_resource(AllValues, '/allvalues/<date>') # Route_3


if __name__ == '__main__':
    app.run(port=5002)
