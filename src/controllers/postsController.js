import fs from "fs";
import { getTodosPosts, criacaoPost, atualizarNovoPost } from "../models/postsModel.js";
import gerarDescricaoComGemini from "../services/geminiService.js"

export async function listarPosts (req, res){
    const posts = await getTodosPosts();
    res.status(200).json(posts);
}

export async function criarPost(req, res){
    const novoPost = req.body;
    try{
        const postCriado = await criacaoPost(novoPost);
        res.status(200).json(postCriado);
    } catch(erro) {
        console.log(erro.message);
        res.status(500).json({"Fallha" : "Falha na Requisicao"});
    }
}

export async function uploadImagem(req, res){
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };

    try{
        const postCriado = await criacaoPost(novoPost);
        const arquivoAtualizado = `uploads/${postCriado.insertedId}.png`;
        fs.renameSync(req.file.path, arquivoAtualizado);
        res.status(200).json(postCriado);
    } catch(erro) {
        console.log(erro.message);
        res.status(500).json({"Fallha" : "Falha na Requisicao"});
    }
}

export async function atualizarPost(req, res){
    const id = req.params.id;
    const urlImg = `http://localhost:3000/${id}.png`;
    try{
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imgBuffer);

        const post = {
            imgUrl: urlImg,
            descricao: descricao,
            alt: req.body.alt
        };

        const postCriado = await atualizarNovoPost(id, post);

        res.status(200).json(postCriado);
    } catch(erro) {
        console.log(erro.message);
        res.status(500).json({"Fallha" : "Falha na Requisicao"});
    }
}