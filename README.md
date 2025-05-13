# SIT737 9.1P – MongoDB Integration with Calculator Microservice

## 🧩 Overview

This project enhances a Node.js calculator microservice by integrating MongoDB as a persistent data store for calculation logs. The entire system is containerized and deployed in a Kubernetes cluster with support for secrets, volumes, and scalable deployments.

---

## 🚀 Deployment Instructions

```bash
kubectl apply -f mongodb-secret.yaml
kubectl apply -f mongo-pvc.yaml
kubectl apply -f mongo-deployment.yaml
kubectl apply -f mongo-service.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

---

## 🔌 API Endpoints

### ✅ Create a log
```bash
curl -X POST http://localhost:8080/api/log -H "Content-Type: application/json" -d "{\"input\":\"5 + 5\", \"output\":\"10\"}"
```

### 📄 Get all logs
```bash
curl http://localhost:8080/api/logs
```

### ✏️ Update a log
```bash
curl -X PUT http://localhost:8080/api/log/YOUR_ID_HERE -H "Content-Type: application/json" -d "{\"output\":\"999\"}"
```

### ❌ Delete a log
```bash
curl -X DELETE http://localhost:8080/api/log/YOUR_ID_HERE
```

---

## 🗂️ Kubernetes Resources

- MongoDB Deployment: `mongo-deployment.yaml`
- MongoDB Service: `mongo-service.yaml`
- MongoDB Volume: `mongo-pvc.yaml`
- Secrets for DB credentials: `mongodb-secret.yaml`
- App Deployment: `deployment.yaml`
- App Service: `service.yaml`

---

## 💾 Backup & Disaster Recovery

### 🔁 Manual Backup (inside MongoDB pod)
```bash
kubectl exec -it <mongodb-pod-name> -- mongodump --out /data/backup
```

### ♻️ Restore
```bash
kubectl exec -it <mongodb-pod-name> -- mongorestore /data/backup
```

> Backups can also be automated using Kubernetes CronJobs or persistent volume snapshots if using a cloud provider.

---

## 📈 Monitoring Tips

- Use `kubectl logs <pod-name>` to view app or DB logs.
- Use `kubectl get pods`, `kubectl describe pod` to check status.
- Consider Prometheus and Grafana for advanced monitoring.

---

## 📎 Notes

- MongoDB credentials are stored as Kubernetes Secrets and injected into the app container as environment variables.
- The application uses `mongoose` for database operations.
