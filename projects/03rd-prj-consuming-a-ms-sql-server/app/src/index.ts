import './preStart'; // Must be the first import
import app from '@server';
import logger from '@shared/Logger';
import { setTimeout } from 'timers';
import * as MsSql from "mssql";import path from 'path';

import express, { NextFunction, Request, Response } from 'express';

var interval_timeout: NodeJS.Timeout;

var config: MsSql.config = {
    user: process.env?.MSSQL_USER,
    database: process.env?.MSSQL_DB || "",
    password: process.env?.MSSQL_PW,
    server: process.env?.MSSQL_SERVER || "",
    port: Number(process.env?.MSSQL_PORT),
    pool: {
        autostart: true
    }
};
var pool: MsSql.ConnectionPool = new MsSql.ConnectionPool(config);

const start_server = async () =>{

    // Stop the interval
    clearInterval( interval_timeout );

    // Start the server
    const port = Number(process.env.PORT || 3000);
    
    app.listen(port, () => {
        console.log('Express server started on port: ' + port);
    });

    
    /************************************************************************************
     *                              Serve front-end content
     ***********************************************************************************/

    const viewsDir = path.join(__dirname, 'views');
    app.set('views', viewsDir);
    const staticDir = path.join(__dirname, 'public');
    app.use(express.static(staticDir));
    app.get('*', (req: Request, res: Response) => {
        res.sendFile('index.html', {root: viewsDir});
    });
}

let create_db = (_pool: MsSql.ConnectionPool) => new Promise((resolve,reject)=>{
            
    _pool.query`IF (DB_ID('hero_db') IS NULL) CREATE DATABASE [hero_db]`
        .then((result)=>{
            console.log("Create DB Result: ", result);
            return resolve(result);
        }, err => {
            return reject(err)
        }
    );
});



let create_table = (_pool: MsSql.ConnectionPool) => new Promise((resolve,reject)=>{
            
    _pool.query`USE [hero_db];
        IF NOT EXISTS (SELECT *
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_NAME = N'heroes' AND TABLE_CATALOG = N'hero_db') 
        BEGIN
            CREATE TABLE [heroes](
                [hero_id] [int] NOT NULL IDENTITY,
                [hero_alias] [varchar](255) NOT NULL,
                [hero_mail] [varchar](255) NULL,
                [hero_identity] [int] NULL
            );
        END`
        .then((result)=>{
            console.log("Create Table Result: ", result);
            return resolve(result);
        }, err => {
            return reject(err)
        }
    );
});


let inser_into_table = (_pool: MsSql.ConnectionPool) => new Promise((resolve,reject)=>{
            
    _pool.query`USE [hero_db];
        IF NOT EXISTS (SELECT *
            FROM [heroes]) 
        BEGIN
            INSERT INTO [heroes]
                ([hero_alias]
                ,[hero_mail]
                ,[hero_identity])
            VALUES
                ('Spiderman','spidy@nerd.com',''),
                ('Ironman','i-am@stark.tower',''),
                ('Hulk','never.gonna@read.smash','')
        END`
        .then((result)=>{
            console.log("Create Table Result: ", result);
            return resolve(result);
        }, err => {
            return reject(err)
        }
    );
});


var connect_db = async() => {

    console.log("Trying to establish a connection to the mssql db.")

    pool.connect().then(async (_pool: MsSql.ConnectionPool)=>{
        console.log("Successfuly connected to db");

        var tmp_err = false;

        
        await create_db(_pool).then((res) => {
            console.log("Create DB result: ", res);
        }, (err) => {
            console.log("Error trying to create a db.");
            tmp_err = true;
        });
        
        if (!tmp_err) await create_table(_pool).then((res) => {
            console.log("Create Table result: ", res);
        }, (err) => {
            console.log("Error trying to create a table.");
            tmp_err = true;
        });
    

        if (!tmp_err) await inser_into_table(_pool).then((res:any) => {
            //console.log("Insert into table result: ", res);
            console.log("Rows affected: ", res)
        }, (err) => {
            console.log("Error trying to insert rows into the table.");
            tmp_err = true;
        });

        if (!tmp_err) start_server();
    

        
        
    },(err) => {
        console.log("Error establishing a db connection", err);
    });
}

interval_timeout = setInterval(connect_db, 10000);
