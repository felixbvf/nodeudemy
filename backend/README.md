# curso-nodejs

# Example venta api 
# localhost:3003/api/venta/add
{
	"usuario": {"_id": "5d8ba1eff974a4455cf0d455"},
	"persona": {"_id": "5d8ba347f974a4455cf0d458"},
	"tipo_comprobante": "FACTURA",
	"serie_comprobante": "002",
	"num_comprobante": "00002",
	"impuesto": "0.18",
	"total": "320",
	"detalles": [
		{
		"_id": "5d8bd3664d8a61629ab5f45c",
		"articulo": "Equipo de computacion",
		"cantidad": "1",
		"precio": "1100",
		"descuento": "10"
		},
		{
		"_id": "5d8bd3934d8a61629ab5f45d",
		"articulo": "Impresora HP",
		"cantidad": "2",
		"precio": "5000",
		"descuento": "10"
		}
	]
}