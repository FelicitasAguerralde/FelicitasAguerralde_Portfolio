# Configuración de Email - Resend

## 🚀 Configuración Rápida

### 1. Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```env
# API Key de Resend (obligatorio)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Remitente del email (opcional - usa dominio de prueba si no se configura)
EMAIL_FROM=Portfolio <contacto@tu-dominio.com>

# Destinatario del email (opcional - usa el por defecto si no se configura)
EMAIL_TO=felicitas.aguerralde@gmail.com
```

### 2. Configurar Dominio Verificado en Resend (Recomendado para Producción)

Para evitar que los emails lleguen a spam, es **altamente recomendado** verificar tu propio dominio:

#### Paso 1: Agregar Dominio en Resend
1. Ve a tu cuenta de Resend: https://resend.com/domains
2. Haz clic en "Add Domain"
3. Ingresa tu dominio (ej: `tu-dominio.com`)

#### Paso 2: Configurar Registros DNS
Resend te dará los siguientes registros DNS que debes agregar en tu proveedor de dominio:

**SPF Record:**
```
Tipo: TXT
Nombre: @ (o tu-dominio.com)
Valor: v=spf1 include:resend.com ~all
```

**DKIM Record:**
```
Tipo: TXT
Nombre: resend._domainkey (o resend._domainkey.tu-dominio.com)
Valor: [Resend te dará un valor único]
```

**DMARC Record (Opcional pero recomendado):**
```
Tipo: TXT
Nombre: _dmarc
Valor: v=DMARC1; p=none; rua=mailto:admin@tu-dominio.com
```

#### Paso 3: Verificar Dominio
1. Espera a que los registros DNS se propaguen (puede tardar hasta 48 horas)
2. En Resend, haz clic en "Verify" para verificar tu dominio
3. Una vez verificado, actualiza `EMAIL_FROM` en tu `.env`:
   ```env
   EMAIL_FROM=Portfolio <contacto@tu-dominio.com>
   ```

### 3. Alternativas si Resend no funciona

Si prefieres usar otro servicio de email:

#### Opción A: Gmail SMTP (para desarrollo)
```env
EMAIL_SERVICE=gmail
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password
```

#### Opción B: SendGrid
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=tu-api-key
EMAIL_FROM=contacto@tu-dominio.com
```

#### Opción C: Mailgun
```env
EMAIL_SERVICE=mailgun
MAILGUN_API_KEY=tu-api-key
MAILGUN_DOMAIN=tu-dominio.com
EMAIL_FROM=contacto@tu-dominio.com
```

## 🔍 Solución de Problemas

### Los emails llegan a spam

**Causas comunes:**
1. ✅ Usar dominio de prueba (`onboarding@resend.dev`)
2. ✅ Dominio no verificado
3. ✅ Falta de registros SPF/DKIM/DMARC
4. ✅ Contenido que parece spam

**Soluciones:**
- Verifica tu dominio en Resend (ver paso 2 arriba)
- Usa un dominio propio verificado
- Evita palabras que suenen a spam en el asunto
- Incluye versión de texto plano (ya implementado)

### No llegan los emails

1. Verifica que `RESEND_API_KEY` esté configurada correctamente
2. Revisa los logs del servidor para ver errores
3. Verifica que el dominio esté verificado en Resend
4. Revisa la carpeta de spam del destinatario

## 📝 Notas Importantes

- El dominio `onboarding@resend.dev` es solo para pruebas y tiene limitaciones
- Para producción, siempre usa un dominio verificado
- Los registros DNS pueden tardar hasta 48 horas en propagarse
- Gmail y otros proveedores pueden marcar emails como spam incluso con dominio verificado si no hay historial
