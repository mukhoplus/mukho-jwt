package com.mukho.pro.common.exception

import com.mukho.pro.common.dto.BaseResponse
import com.mukho.pro.common.status.ResultCode
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class CustomExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException::class)
    protected fun handleValidationExceptions(ex: MethodArgumentNotValidException):
            ResponseEntity<BaseResponse<Map<String, String>>> {
        val errors = mutableMapOf<String, String>()
        ex.bindingResult.allErrors.forEach { error ->
            val fieldName = (error as FieldError).field
            val errorMessage = error.getDefaultMessage()
            errors[fieldName] = errorMessage ?: "Not Exception Message"
        }
        return ResponseEntity(BaseResponse(
            ResultCode.ERROR.name,
            errors,
            ResultCode.ERROR.msg
        ), HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(InvalidInputException::class)
    protected fun invalidInputException(ex: InvalidInputException):
            ResponseEntity<BaseResponse<Map<String, String>>> {
        val errors = mapOf(ex.fieldName to (ex.message ?: "Not Exception Message"))
        return ResponseEntity(BaseResponse(
            ResultCode.ERROR.name,
            errors,
            ResultCode.ERROR.msg
        ), HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(Exception::class)
    protected fun defaultException(ex: Exception):
            ResponseEntity<BaseResponse<Map<String, String>>> {
        val errors = mapOf(" " to (ex.message ?: "Not Exception Message"))
        return ResponseEntity(BaseResponse(
            ResultCode.ERROR.name,
            errors,
            ResultCode.ERROR.msg
        ), HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(BadCredentialsException::class)
    protected fun badCredentialsException(ex: BadCredentialsException):
            ResponseEntity<BaseResponse<Map<String, String>>> {
        val errors = mapOf("로그인 실패" to "아이디 혹은 비밀번호를 다시 확인하세요.")
        return ResponseEntity(BaseResponse(
            ResultCode.ERROR.name,
            errors,
            ResultCode.ERROR.msg
        ), HttpStatus.BAD_REQUEST)
    }
}