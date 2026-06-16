<div align="center">
  <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80" alt="Modern Real Estate Building" width="1000"/>
  
  <h1>🏢 Real Estate App — Backend API</h1>
  <p><strong>Multi-Tenant SaaS Platform for Real Estate Agencies</strong></p>

  <p>
    <a href="https://www.php.net/"><img src="https://img.shields.io/badge/PHP-8.3-777BB4?style=for-the-badge&logo=php&logoColor=white" /></a>
    <a href="https://laravel.com/"><img src="https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" /></a>
    <a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" /></a>
    <a href="https://laravel.com/docs/12.x/sanctum"><img src="https://img.shields.io/badge/Sanctum-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" /></a>
  </p>
</div>

---

## 📖 Project Overview

A multi-tenant SaaS platform for real estate agencies built with Laravel. Handles property listings, CRM pipelines, secure document vaulting (KYC/Title Deeds), and escrow tracking.

---

## 🛠️ Stack

| Component | Technology |
|-----------|------------|
| **Runtime** | PHP 8.3 |
| **Framework** | Laravel 12 |
| **Database** | MySQL |
| **Auth** | Laravel Sanctum (token-based, CSRF-protected) |
| **Storage** | Supabase S3 (private bucket for KYC and title deeds) |
| **Queue** | Laravel Jobs (notifications, matching algorithm) |
| **Scheduler** | Laravel Cron (auto-expire listings) |

---

## 🏗️ Architecture

Multi-tenancy is handled via **Logical Tenant Separation** — every model scoped to `agency_id` through a Laravel Global Scope. No agency can query another's data at the database level.
