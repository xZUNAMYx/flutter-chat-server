const {response} = require('express');

const bcrypt = require('bcryptjs');

const Usuario = require('../models/user');
const { generarJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const usuarioDB = await Usuario.findOne({email: email});
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // Validar password
        const validarPassword = bcrypt.compareSync( password, usuarioDB.password );
        if (!validarPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es valida'
            });
        }

        // Generar JWT
        const token = await generarJWT( usuarioDB.id );
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}

const crearUsuario =  async (req, res = response) => {

    const email = req.body.email;

    try {
        const existeEmail = await Usuario.findOne({email: email});
        if(existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'Erorr al intentar crear nueva cuenta'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( usuario.password, salt);

        await usuario.save();

        // Generar mi JWT
        const token = await generarJWT( usuario.id );    

        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
   
}

const renewToken = async (req, res = response) => {
    const uid = req.uid;

    const token = await generarJWT( uid );

    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuario,
        token
    });
   
}

module.exports = {
    crearUsuario,
    login, 
    renewToken
}