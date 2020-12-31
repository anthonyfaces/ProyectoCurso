
/****************************************************************************************
	
					EJECUTAR PARA LA NUEVA OPCION DE MENU

****************************************************************************************/

-- Crear una nueva Opcion de Menu

	INSERT INTO menu(id_menu, nombre, icono, url) 
	VALUES (10, 'Signos Vitales', 'assignment', '/signo');
	
-- Agregar  una Opcion de Menu para el Rol 'ADMIN'
	
	INSERT INTO menu_rol (id_menu, id_rol) VALUES (10, 1);
	




/****************************************************************************************
					
								JSON DE PRUEBA

*****************************************************************************************	

	
	
	{
		"paciente" : {
			"idPaciente" : 1
		},
		"temperatura" : 36.5,
		"pulso" : 80,
		"frecRespiratoria" : 15,
		"fecha" : "2020-12-19T15:00:00.000Z"			
	}
	

****************************************************************************************/









