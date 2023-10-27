const Playlist = require("../models/playlist");
const fs = require("fs");
const path = require("path");
const playlist = require("../models/playlist");

const save = async (req, res) => {
    //Recoger datos del body
    let params = req.body;
    //Crear la playlist
    let playlist = new Playlist(params);
    //Guardarlo
    try {
      const playlistStored = await playlist.save();
      return res.status(200).send({
        status: "success",
        message: "Se ha guardado la playlist",
        playlist: playlistStored,
      });
    } catch (err) {
      return res.status(400).send({
        status: "error",
        message: err.message,
      });
    }
  };

  const list = async (req, res) =>{
    const userId = req.params.userId;
    try{

      const playlists = await Playlist.find({user: userId}).sort('created_at');
      return res.status(200).send({
        status: "success",
        playlists: playlists,
      });
    }catch(err){
      return res.status(400).send({
        status: "error",
        message: err.message,
      });
    }
  }

  const addSong = async (req, res) =>{
    const playlistId = req.body.playlistId;
    const song = req.body.song;
    try{
      const playlist = await Playlist.findById(playlistId);
      playlist.songs.push(song);
      playlist.save();
      return res.status(200).send({
        status: "success",
        playlist: playlist,
        message: 'Se ha añadido la cancion a la playlist'
      });
    }catch(err){
      console.log(err);
      return res.status(400).send({
        status: "error",
        message: err.message,
      });
    }
  }

  const songList = async (req, res) =>{
    const playlistId = req.params.playlistId;
    try{
      const playlist = await Playlist.findById(playlistId);
      
      return res.status(200).send({
        status: "success",
        songs: playlist.songs,
      });
    }catch(err){
      console.log(err);
      return res.status(400).send({
        status: "error",
        message: err.message,
      });
    }
  }

  module.exports = {
    save,
    list,
    addSong,
    songList
  }