-- Run this in SSMS to set up the database

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'ResearchGroupDB')
BEGIN
  CREATE DATABASE ResearchGroupDB;
END
GO

USE ResearchGroupDB;
GO

IF OBJECT_ID('dbo.users', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL UNIQUE,
    email NVARCHAR(100) NOT NULL UNIQUE,
    password_hash NVARCHAR(200) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 NULL
  );
END
GO

IF OBJECT_ID('dbo.papers', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.papers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    title NVARCHAR(255) NOT NULL,
    paper_type NVARCHAR(100) NOT NULL,
    publisher NVARCHAR(100) NOT NULL,
    abstract NVARCHAR(MAX) NULL,
    file_url NVARCHAR(500) NULL,
    status NVARCHAR(50) NOT NULL DEFAULT 'submitted',
    submitted_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_papers_users FOREIGN KEY (user_id) REFERENCES dbo.users(id)
  );
END
GO

IF OBJECT_ID('dbo.feedback', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.feedback (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NULL,
    publisher NVARCHAR(100) NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    contact_email NVARCHAR(100) NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_feedback_users FOREIGN KEY (user_id) REFERENCES dbo.users(id)
  );
END
GO

IF OBJECT_ID('dbo.messages', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.messages (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NULL,
    subject NVARCHAR(255) NOT NULL,
    body NVARCHAR(MAX) NOT NULL,
    tags NVARCHAR(MAX) NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_messages_users FOREIGN KEY (user_id) REFERENCES dbo.users(id)
  );
END
GO
