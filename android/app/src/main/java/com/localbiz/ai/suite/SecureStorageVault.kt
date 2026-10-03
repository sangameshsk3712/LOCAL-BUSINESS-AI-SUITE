package com.localbiz.ai.suite

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

/**
 * SecureStorageVault: Hardware-backed Android Keystore with AES-256-GCM encryption.
 * Encrypts API keys, user tokens, revenue records, and offline customer databases.
 */
class SecureStorageVault(context: Context) {

    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    private val sharedPreferences = EncryptedSharedPreferences.create(
        context,
        "local_business_encrypted_vault",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    fun encryptAndSave(key: String, value: String): Boolean {
        return try {
            sharedPreferences.edit().putString(key, value).apply()
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    fun retrieveAndDecrypt(key: String): String? {
        return try {
            sharedPreferences.getString(key, null)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    fun removeKey(key: String) {
        sharedPreferences.edit().remove(key).apply()
    }
}
