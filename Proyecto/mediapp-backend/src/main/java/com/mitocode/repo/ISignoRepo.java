package com.mitocode.repo;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mitocode.model.Signo;

public interface ISignoRepo extends IGenericRepo<Signo, Integer>{
	
	@Query("FROM Signo s WHERE s.paciente.idPaciente = :id")
	List<Signo> listarPorIdPaciente(@Param("id") Integer id);
		

}
