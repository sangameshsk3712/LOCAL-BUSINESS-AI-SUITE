package com.localbiz.ai.suite

import android.content.Context
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import java.io.ByteArrayOutputStream

/**
 * VoiceLeadRecorder: Low-latency PCM raw audio streaming for AI Receptionist.
 * Bypasses high-latency compressed formats to enable real-time Gemini Voice transcription.
 */
class VoiceLeadRecorder(private val context: Context) {

    private val sampleRate = 16000 // 16kHz optimal for Gemini speech models
    private val channelConfig = AudioFormat.CHANNEL_IN_MONO
    private val audioFormat = AudioFormat.ENCODING_PCM_16BIT

    private var audioRecord: AudioRecord? = null
    private var isRecording = false

    fun startStreamRecording(chunkCallback: (ByteArray) -> Unit) {
        val bufferSize = AudioRecord.getMinBufferSize(sampleRate, channelConfig, audioFormat)
        try {
            audioRecord = AudioRecord(
                MediaRecorder.AudioSource.MIC,
                sampleRate,
                channelConfig,
                audioFormat,
                bufferSize
            )

            audioRecord?.startRecording()
            isRecording = true

            Thread {
                val buffer = ByteArray(bufferSize)
                while (isRecording) {
                    val read = audioRecord?.read(buffer, 0, buffer.size) ?: 0
                    if (read > 0) {
                        val chunk = buffer.copyOf(read)
                        chunkCallback(chunk)
                    }
                }
            }.start()
        } catch (e: SecurityException) {
            e.printStackTrace()
        }
    }

    fun stopRecording() {
        isRecording = false
        try {
            audioRecord?.stop()
            audioRecord?.release()
            audioRecord = null
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
