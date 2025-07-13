package main

import (
	"database/sql"
	"log"
	"net/http"
)

var db *sql.DB

func main() {
	db = connectDB()
	defer db.Close()

	// Статические файлы
	fs := http.FileServer(http.Dir("../frontend"))
	http.Handle("/", fs)

	// API endpoints
	http.HandleFunc("/items", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		
		if r.Method == "OPTIONS" {
			return
		}
		
		switch r.Method {
		case "GET":
			getItems(w, r)
		case "POST":
			createItem(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})


	http.HandleFunc("/update-item", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "PUT" {
			updateItem(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/delete-item", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "DELETE" {
			deleteItem(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})


	log.Println("Server starting on :8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
