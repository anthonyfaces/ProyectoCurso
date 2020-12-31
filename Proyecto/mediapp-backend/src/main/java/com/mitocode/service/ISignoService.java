package com.mitocode.service;

import java.util.List;

import org.springframework.data.repository.query.Param;

import com.mitocode.model.Signo;

public interface ISignoService extends ICRUD<Signo, Integer>{
	
	List<Signo> listarPorIdPaciente(@Param("id") Integer id);

}
