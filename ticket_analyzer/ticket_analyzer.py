import os
import re
from PIL import Image
import pytesseract

class TicketAnalyzer:
    def __init__(self):
        self.tickets_data = []

    def list_date_folders(self):
        tickets_path = "tickets"
        if not os.path.exists(tickets_path):
            print("No se encontró la carpeta 'tickets'")
            return []
        folders = [f for f in os.listdir(tickets_path) if os.path.isdir(os.path.join(tickets_path, f))]
        folders.sort()
        return folders

    def list_ticket_files(self, date_folder):
        folder_path = os.path.join("tickets", date_folder)
        files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff'))]
        return files

    def extract_text_from_image(self, image_path):
        try:
            image = Image.open(image_path)
            text = pytesseract.image_to_string(image, lang='spa')
            return text
        except Exception as e:
            print(f"Error al procesar la imagen: {e}")
            return ""

    def parse_ticket_data(self, text):
        lines = text.split('\n')
        supermercado = "Supermercado desconocido"
        for line in lines[:10]:
            line = line.strip()
            if line and not re.match(r'^\d', line) and len(line) > 3:
                supermercado = line
                break

        productos = []
        price_pattern = r'(\d+[,\.]\d{2})\s*€?'
        for line in lines:
            line = line.strip()
            if not line:
                continue
            price_matches = re.findall(price_pattern, line)
            if price_matches:
                product_name = re.sub(price_pattern, '', line).strip()
                product_name = re.sub(r'[€\s]+$', '', product_name).strip()
                if product_name and len(product_name) > 2:
                    for price_str in price_matches:
                        price = float(price_str.replace(',', '.'))
                        if price > 0:
                            productos.append({
                                'nombre': product_name,
                                'precio': price
                            })
        return {
            'supermercado': supermercado,
            'productos': productos
        }

    def assign_products(self, productos, supermercado):
        assignments = []
        print(f"\n=== Asignación de productos ===")
        print(f"Supermercado: {supermercado}")
        print("Productos encontrados:")
        for i, producto in enumerate(productos, 1):
            print(f"{i}. {producto['nombre']} - {producto['precio']:.2f}€")
        print("\nAsigna cada producto:")
        print("A = Alba, P = Petru, X = Dividir entre ambos")
        for producto in productos:
            while True:
                respuesta = input(f"\n{producto['nombre']} ({producto['precio']:.2f}€) -> ").upper().strip()
                if respuesta == 'A':
                    assignments.append({'alba': producto['precio'], 'petru': 0})
                    break
                elif respuesta == 'P':
                    assignments.append({'alba': 0, 'petru': producto['precio']})
                    break
                elif respuesta == 'X':
                    mitad = producto['precio'] / 2
                    assignments.append({'alba': mitad, 'petru': mitad})
                    break
                else:
                    print("Respuesta inválida. Usa A, P o X.")
        descripcion = input(f"\nDescripción breve para {supermercado}: ").strip()
        if not descripcion:
            descripcion = "Compra general"
        return assignments, descripcion

    def update_totals(self, assignments, supermercado, fecha, descripcion):
        total_alba = sum(a['alba'] for a in assignments)
        total_petru = sum(a['petru'] for a in assignments)
        self.tickets_data.append({
            'supermercado': supermercado,
            'fecha': fecha,
            'descripcion': descripcion,
            'alba': total_alba,
            'petru': total_petru
        })

    def show_summary(self):
        print("\n" + "="*50)
        print("RESUMEN ACTUAL")
        print("="*50)
        petru_tickets = [t for t in self.tickets_data if t['petru'] > 0]
        alba_tickets = [t for t in self.tickets_data if t['alba'] > 0]
        if petru_tickets:
            print("\nPetru:")
            for t in petru_tickets:
                print(f"-{t['supermercado']} | {self.format_fecha(t['fecha'])}: {t['petru']:.2f}€ ({t['descripcion']})")
        if alba_tickets:
            print("\nAlba:")
            for t in alba_tickets:
                print(f"-{t['supermercado']} | {self.format_fecha(t['fecha'])}: {t['alba']:.2f}€ ({t['descripcion']})")
        print("="*50)

    def generate_final_message(self):
        print("\n" + "="*50)
        print("MENSAJE FINAL")
        print("="*50)
        petru_tickets = [t for t in self.tickets_data if t['petru'] > 0]
        alba_tickets = [t for t in self.tickets_data if t['alba'] > 0]
        if petru_tickets:
            print("\nPetru:")
            for t in petru_tickets:
                print(f"-{t['supermercado']} | {self.format_fecha(t['fecha'])}: {t['petru']:.2f}€ ({t['descripcion']})")
        if alba_tickets:
            print("\nAlba:")
            for t in alba_tickets:
                print(f"-{t['supermercado']} | {self.format_fecha(t['fecha'])}: {t['alba']:.2f}€ ({t['descripcion']})")

    def format_fecha(self, fecha):
        # Si la fecha es tipo 2025-06-13, la pasa a 13/06/2025
        if re.match(r'\d{4}-\d{2}-\d{2}', fecha):
            partes = fecha.split('-')
            return f"{partes[2]}/{partes[1]}/{partes[0]}"
        return fecha

    def process_ticket(self, date_folder, ticket_file):
        image_path = os.path.join("tickets", date_folder, ticket_file)
        print(f"\nProcesando: {ticket_file}")
        print("Extrayendo texto...")
        text = self.extract_text_from_image(image_path)
        if not text.strip():
            print("No se pudo extraer texto de la imagen")
            return None
        ticket_data = self.parse_ticket_data(text)
        if not ticket_data['productos']:
            print("No se encontraron productos en el ticket")
            return None
        assignments, descripcion = self.assign_products(
            ticket_data['productos'],
            ticket_data['supermercado']
        )
        # Guardar la fecha desde el nombre de la carpeta
        self.update_totals(assignments, ticket_data['supermercado'], date_folder, descripcion)
        return {
            'data': ticket_data,
            'assignments': assignments,
            'descripcion': descripcion
        }

    def run(self):
        print("=== ANALIZADOR DE TICKETS ===")
        while True:
            # Seleccionar carpeta de fecha
            date_folders = self.list_date_folders()
            if not date_folders:
                print("No se encontraron carpetas de fecha")
                return
            print("\nCarpetas de fecha disponibles:")
            for i, folder in enumerate(date_folders, 1):
                print(f"{i}. {folder}")
            while True:
                try:
                    choice = int(input("\nSelecciona una carpeta (número): ")) - 1
                    if 0 <= choice < len(date_folders):
                        selected_date = date_folders[choice]
                        break
                    else:
                        print("Número inválido")
                except ValueError:
                    print("Introduce un número válido")
            # Seleccionar ticket
            ticket_files = self.list_ticket_files(selected_date)
            if not ticket_files:
                print(f"No se encontraron tickets en {selected_date}")
                continue
            print(f"\nTickets en {selected_date}:")
            for i, ticket in enumerate(ticket_files, 1):
                print(f"{i}. {ticket}")
            while True:
                try:
                    choice = int(input("\nSelecciona un ticket (número): ")) - 1
                    if 0 <= choice < len(ticket_files):
                        selected_ticket = ticket_files[choice]
                        break
                    else:
                        print("Número inválido")
                except ValueError:
                    print("Introduce un número válido")
            # Procesar ticket
            last_ticket_data = self.process_ticket(selected_date, selected_ticket)
            if last_ticket_data is None:
                continue
            # Mostrar resumen y opciones
            while True:
                self.show_summary()
                print("\nOpciones:")
                print("S = Finalizar y mostrar mensaje")
                print("R = Repetir asignación del último ticket")
                print("M = Añadir más tickets")
                option = input("\n¿Qué deseas hacer? (S/R/M): ").upper().strip()
                if option == 'S':
                    self.generate_final_message()
                    return
                elif option == 'R':
                    if self.tickets_data:
                        self.tickets_data.pop()
                    last_ticket_data = self.process_ticket(selected_date, selected_ticket)
                elif option == 'M':
                    break
                else:
                    print("Opción inválida")

if __name__ == "__main__":
    analyzer = TicketAnalyzer()
    analyzer.run()
